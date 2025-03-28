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
  if (!m.quoted) return conn.reply(m.chat, '✳️ Responde a una nota de voz, audio o video para identificar la canción.', m)

  let q = m.quoted
  let mime = q.mimetype || ''
  if (!/audio|video/.test(mime)) return conn.reply(m.chat, '✳️ Solo puedo analizar notas de voz, audios o videos.', m)

  await m.react('🔍')

  try {
    const tmpDir = path.resolve('./tmp')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)
    const ext = /audio/.test(mime) ? 'mp3' : 'mp4'
    const inputPath = path.join(tmpDir, `${Date.now()}.${ext}`)

    // Descargar archivo citado
    const stream = await downloadContentFromMessage(q, /audio/.test(mime) ? 'audio' : 'video')
    const writer = fs.createWriteStream(inputPath)
    for await (const chunk of stream) writer.write(chunk)
    writer.end()

    // Subir a tu hosting
    const form = new FormData()
    form.append('file', fs.createReadStream(inputPath))
    form.append('expiry', '3600')

    const upload = await axios.post('https://cdn.russellxz.click/upload.php', form, {
      headers: form.getHeaders()
    })

    if (!upload.data?.url) throw new Error('No se pudo subir el archivo')
    const fileUrl = upload.data.url

    // Analizar música
    const info = await axios.get(`https://api.neoxr.eu/api/whatmusic?url=${encodeURIComponent(fileUrl)}&apikey=russellxz`)
    if (!info.data.status || !info.data.data) throw new Error('No se pudo identificar la canción')

    const { title, artist, album, release } = info.data.data
    const ytSearch = await yts(`${title} ${artist}`)
    const video = ytSearch.videos[0]
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
⏳ *Descargando la canción...*
`

    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: banner
    }, { quoted: m })

    const ytRes = await axios.get(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(video.url)}&type=audio&quality=128kbps&apikey=russellxz`)
    const audioURL = ytRes.data.data.url

    const rawPath = path.join(tmpDir, `${Date.now()}_raw.m4a`)
    const finalPath = path.join(tmpDir, `${Date.now()}_final.mp3`)

    const audioRes = await axios.get(audioURL, { responseType: 'stream' })
    await streamPipeline(audioRes.data, fs.createWriteStream(rawPath))

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

    fs.unlinkSync(inputPath)
    fs.unlinkSync(rawPath)
    fs.unlinkSync(finalPath)

    await m.react('✅')

  } catch (err) {
    console.error(err)
    await conn.reply(m.chat, `❌ *Error:* ${err.message}`, m)
    await m.react('❌')
  }
}

handler.help = ['whatmusic']
handler.tags = ['tools']
handler.command = ['whatmusic']
handler.register = true

export default handler
