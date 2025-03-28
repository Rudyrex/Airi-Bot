import fs from 'fs'
import path from 'path'
import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import FormData from 'form-data'
import yts from 'yt-search'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { downloadContentFromMessage } from 'baileys'

const streamPipeline = promisify(pipeline)

let handler = async (m, { conn }) => {
    try {
        console.log('📥 Ejecutando comando whatmusic...')

        if (!m.quoted) {
            console.log('⚠️ No hay mensaje citado')
            return await conn.reply(m.chat, '✳️ Responde a una nota de voz, audio o video para identificar la canción.', m)
        }

        const q = m.quoted
        const mime = q.mimetype || ''
        if (!/audio|video/.test(mime)) {
            console.log('⚠️ El archivo citado no es audio ni video:', mime)
            return await conn.reply(m.chat, '✳️ Solo puedo analizar notas de voz, audios o videos.', m)
        }

        await m.react('🔍')
        const tmpDir = path.resolve('./tmp')
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)
        const ext = /audio/.test(mime) ? 'mp3' : 'mp4'
        const inputPath = path.join(tmpDir, `${Date.now()}.${ext}`)

        console.log('⬇️ Descargando archivo citado...')
        const stream = await downloadContentFromMessage(q, /audio/.test(mime) ? 'audio' : 'video')
        const writer = fs.createWriteStream(inputPath)
        for await (const chunk of stream) writer.write(chunk)
        writer.end()

        // Subir archivo
        const form = new FormData()
        form.append('file', fs.createReadStream(inputPath))
        form.append('expiry', '3600')

        console.log('☁️ Subiendo archivo a russellxz.click...')
        const upload = await axios.post('https://cdn.russellxz.click/upload.php', form, {
            headers: form.getHeaders()
        })

        const fileUrl = upload.data?.url
        if (!fileUrl) throw new Error('No se pudo subir el archivo')

        console.log('🎶 Buscando coincidencias de audio...')
        const info = await axios.get(`https://api.neoxr.eu/api/whatmusic?url=${encodeURIComponent(fileUrl)}&apikey=russellxz`)
        const { title, artist, album, release } = info.data?.data || {}
        if (!title) throw new Error('No se pudo identificar la canción')

        console.log('🔎 Buscando en YouTube...')
        const yt = await yts(`${title} ${artist}`)
        const video = yt.videos[0]
        if (!video) throw new Error("No se encontró la canción en YouTube")

        const banner = `
╭───⬣「 *Canción Detectada* 」⬣
├ 📌 *Título:* ${title}
├ 👤 *Artista:* ${artist}
├ 💿 *Álbum:* ${album}
├ 📅 *Lanzamiento:* ${release}
├ 🔎 *Resultado:* ${video.title}
├ ⏱️ *Duración:* ${video.timestamp}
├ 👁️ *Vistas:* ${video.views.toLocaleString()}
├ 📺 *Canal:* ${video.author.name}
├ 🔗 *Enlace:* ${video.url}
╰───────────────╯
⏳ *Descargando la canción...*`

        await conn.sendMessage(m.chat, {
            image: { url: video.thumbnail },
            caption: banner
        }, { quoted: m })

        // Descargar audio
        const ytRes = await axios.get(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(video.url)}&type=audio&quality=128kbps&apikey=russellxz`)
        const audioURL = ytRes.data.data.url

        const rawPath = path.join(tmpDir, `${Date.now()}_raw.m4a`)
        const finalPath = path.join(tmpDir, `${Date.now()}_final.mp3`)

        console.log('⬇️ Descargando audio desde YouTube...')
        const audioRes = await axios.get(audioURL, { responseType: 'stream' })
        await streamPipeline(audioRes.data, fs.createWriteStream(rawPath))

        console.log('🎧 Convirtiendo a MP3...')
        await new Promise((resolve, reject) => {
            ffmpeg(rawPath)
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .save(finalPath)
                .on('end', resolve)
                .on('error', reject)
        })

        await conn.sendMessage(m.chat, {
            audio: fs.readFileSync(finalPath),
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m })

        // Limpiar archivos
        fs.unlinkSync(inputPath)
        fs.unlinkSync(rawPath)
        fs.unlinkSync(finalPath)

        await m.react('✅')
        console.log('✅ Proceso finalizado correctamente')

    } catch (err) {
        console.error('❌ Error en whatmusic:', err)
        await m.react('❌')
        await conn.reply(m.chat, `❌ *Error:* ${err.message}`, m)
    }
}

handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = ['whatmusic']
handler.register = true

export default handler
