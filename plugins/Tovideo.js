import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { spawn } from 'child_process'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { downloadContentFromMessage } from 'baileys'

const streamPipeline = promisify(pipeline)

let handler = async (m, { conn }) => {
  try {
    console.log('⏳ Ejecutando comando tovideo...')

    const quoted = m.quoted?.stickerMessage || m.quoted
    const mime = m.quoted?.mimetype || ''

    if (!/webp/.test(mime)) {
      console.log('⚠️ No se citó un sticker válido:', mime)
      return await conn.reply(m.chat, '⚠️ Responde a un sticker para convertirlo a video.', m)
    }

    await m.react('⏳')

    const tmpDir = './tmp'
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

    const inputPath = path.join(tmpDir, `${Date.now()}.webp`)
    const outputPath = path.join(tmpDir, `${Date.now()}_out.mp4`)

    // Descargar sticker
    const stream = await downloadContentFromMessage(m.quoted, 'sticker')
    const writer = fs.createWriteStream(inputPath)
    for await (const chunk of stream) writer.write(chunk)
    writer.end()

    console.log('⬆️ Subiendo sticker a russellxz.click...')
    const form = new FormData()
    form.append('file', fs.createReadStream(inputPath))

    const upload = await axios.post('https://cdn.russellxz.click/upload.php', form, {
      headers: form.getHeaders()
    })

    if (!upload.data?.url) throw new Error('No se pudo subir el sticker')

    const apiUrl = `https://api.neoxr.eu/api/webp2mp4?url=${encodeURIComponent(upload.data.url)}&apikey=russellxz`
    console.log('➡️ Llamando a la API:', apiUrl)

    const convert = await axios.get(apiUrl)
    const videoUrl = convert.data?.data?.url
    if (!videoUrl) throw new Error('No se pudo convertir el sticker a video')

    const tempMp4 = path.join(tmpDir, `${Date.now()}_orig.mp4`)
    console.log('⬇️ Descargando video convertido...')
    const videoRes = await axios.get(videoUrl, { responseType: 'stream' })
    await streamPipeline(videoRes.data, fs.createWriteStream(tempMp4))

    // Convertir con ffmpeg
    console.log('🛠️ Procesando video final con ffmpeg...')
    await new Promise((resolve, reject) => {
      const ff = spawn('ffmpeg', ['-i', tempMp4, '-c:v', 'libx264', '-preset', 'fast', '-pix_fmt', 'yuv420p', outputPath])
      ff.on('exit', code => code === 0 ? resolve() : reject(new Error('Error en ffmpeg')))
    })

    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(outputPath),
      mimetype: 'video/mp4',
      caption: '✅ Sticker convertido a video.\n\n© Azura Ultra 2.0'
    }, { quoted: m })

    // Borrar archivos temporales
    fs.unlinkSync(inputPath)
    fs.unlinkSync(tempMp4)
    fs.unlinkSync(outputPath)

    await m.react('✅')
    console.log('✅ Conversión completada con éxito')

  } catch (e) {
    console.error('❌ Error en tovideo:', e)
    await m.react('❌')
    await conn.reply(m.chat, `❌ *Error:* ${e.message}`, m)
  }
}

handler.command = ['tovideo']
handler.help = ['tovideo']
handler.tags = ['tools']
handler.register = true

export default handler
