import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { spawn } from 'child_process';
import FormData from 'form-data';
import { promisify } from 'util';
import { pipeline } from 'stream';
const streamPipeline = promisify(pipeline);

let handler = async (m, { conn }) => {
  // Validar que se responda a un sticker
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
  if (!quoted) {
    await conn.sendMessage(m.chat, { text: "⚠️ Responde a un sticker para convertirlo a video." }, { quoted: m });
    return;
  }

  // Reaccionar con ⏳ para indicar que se está procesando, mi bebesito
  m.react('⏳');

  try {
    // Directorio temporal
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const inputPath = path.join(tmpDir, `${Date.now()}.webp`);
    const outputPath = path.join(tmpDir, `${Date.now()}_out.mp4`);

    // Descargar el sticker
    const stream = await downloadContentFromMessage(quoted, 'sticker');
    const writer = fs.createWriteStream(inputPath);
    for await (const chunk of stream) writer.write(chunk);
    writer.end();

    // Subir el sticker a russell.click
    const form = new FormData();
    form.append("file", fs.createReadStream(inputPath));
    const upload = await axios.post("https://cdn.russellxz.click/upload.php", form, {
      headers: form.getHeaders()
    });
    if (!upload.data?.url) throw new Error("No se pudo subir el sticker.");

    // Convertir a video usando la API
    const conv = await axios.get(`https://api.neoxr.eu/api/webp2mp4?url=${encodeURIComponent(upload.data.url)}&apikey=russellxz`);
    const videoUrl = conv.data?.data?.url;
    if (!videoUrl) throw new Error("No se pudo convertir el sticker a video.");

    // Descargar el video convertido
    const res = await axios.get(videoUrl, { responseType: 'stream' });
    const tempMp4 = path.join(tmpDir, `${Date.now()}_orig.mp4`);
    await streamPipeline(res.data, fs.createWriteStream(tempMp4));

    // Convertir el video con ffmpeg para compatibilidad
    await new Promise((resolve, reject) => {
      const ff = spawn('ffmpeg', ['-i', tempMp4, '-c:v', 'libx264', '-preset', 'fast', '-pix_fmt', 'yuv420p', outputPath]);
      ff.on('exit', code => code === 0 ? resolve() : reject(new Error("Error en ffmpeg")));
    });

    // Enviar el video final al chat
    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(outputPath),
      mimetype: 'video/mp4',
      caption: '✅ Sticker convertido a video.\n\n© Azura Ultra 2.0'
    }, { quoted: m });

    // Eliminar archivos temporales
    fs.unlinkSync(inputPath);
    fs.unlinkSync(tempMp4);
    fs.unlinkSync(outputPath);

    // Reaccionar con ✅ al terminar, mi rey
    m.react('✅');
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { text: `❌ *Error:* ${e.message}` }, { quoted: m });
    m.react('❌');
  }
};

handler.command = ['tovideo'];
export default handler;
