import fs from 'fs';
import path from 'path';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import FormData from 'form-data';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import yts from 'yt-search';
import { fileURLToPath } from 'url';

const streamPipeline = promisify(pipeline);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn }) => {
  const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quotedMsg || (!quotedMsg.audioMessage && !quotedMsg.videoMessage)) {
    await conn.sendMessage(
      m.chat,
      { text: "✳️ Responde a una nota de voz, audio o video para identificar la canción." },
      { quoted: m }
    );
    return;
  }

  m.react('🔍');

  try {
    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const fileExt = quotedMsg.audioMessage ? 'mp3' : 'mp4';
    const inputPath = path.join(tmpDir, `${Date.now()}.${fileExt}`);

    // Descargar el archivo
    const stream = await downloadContentFromMessage(
      quotedMsg.audioMessage || quotedMsg.videoMessage,
      quotedMsg.audioMessage ? 'audio' : 'video'
    );
    const writer = fs.createWriteStream(inputPath);
    for await (const chunk of stream) writer.write(chunk);
    writer.end();

    // Subir a russellxz.click
    const form = new FormData();
    form.append('file', fs.createReadStream(inputPath));
    form.append('expiry', '3600');

    const upload = await axios.post('https://cdn.russellxz.click/upload.php', form, {
      headers: form.getHeaders()
    });
    if (!upload.data || !upload.data.url) throw new Error('No se pudo subir el archivo');
    const fileUrl = upload.data.url;

    // Buscar canción en la API de neoxr
    const apiURL = `https://api.neoxr.eu/api/whatmusic?url=${encodeURIComponent(fileUrl)}&apikey=russellxz`;
    const res = await axios.get(apiURL);
    if (!res.data.status || !res.data.data) throw new Error('No se pudo identificar la canción');

    const { title, artist, album, release } = res.data.data;

    // Buscar en YouTube
    const ytSearch = await yts(`${title} ${artist}`);
    const video = ytSearch.videos[0];
    if (!video) throw new Error("No se encontró la canción en YouTube");

    const banner = `
╔══════════════════╗
║ ✦ 𝘼𝙕𝙐𝙍𝘼 𝙐𝙇𝙏𝙍𝘼 𝟮.𝟬 𝗕𝗢𝗧 ✦
╚══════════════════╝

🎵 *Canción detectada:*  
╭───────────────╮  
├ 📌 *Título:* ${title}
├ 👤 *Artista:* ${artist}
├ 💿 *Álbum:* ${album}
├ 📅 *Lanzamiento:* ${release}
├ 🔎 *Buscando:* ${video.title}
├ ⏱️ *Duración:* ${video.timestamp}
├ 👁️ *Vistas:* ${video.views.toLocaleString()}
├ 📺 *Canal:* ${video.author.name}
├ 🔗 *Link:* ${video.url}
╰───────────────╯

⏳ *Espere un momento, descargando la canción...*`;

    await conn.sendMessage(
      m.chat,
      { image: { url: video.thumbnail }, caption: banner },
      { quoted: m }
    );

    // Descargar el audio desde YouTube
    const ytRes = await axios.get(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(video.url)}&type=audio&quality=128kbps&apikey=russellxz`);
    const audioURL = ytRes.data.data.url;

    const rawPath = path.join(tmpDir, `${Date.now()}_raw.m4a`);
    const finalPath = path.join(tmpDir, `${Date.now()}_final.mp3`);

    const audioRes = await axios.get(audioURL, { responseType: 'stream' });
    await streamPipeline(audioRes.data, fs.createWriteStream(rawPath));

    // Convertir con FFmpeg a MP3
    await new Promise((resolve, reject) => {
      ffmpeg(rawPath)
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
        .save(finalPath)
        .on('end', resolve)
        .on('error', reject);
    });

    await conn.sendMessage(
      m.chat,
      { audio: fs.readFileSync(finalPath), mimetype: 'audio/mpeg', fileName: `${title}.mp3` },
      { quoted: m }
    );

    fs.unlinkSync(inputPath);
    fs.unlinkSync(rawPath);
    fs.unlinkSync(finalPath);

    m.react('✅');
  } catch (err) {
    console.error(err);
    await conn.sendMessage(
      m.chat,
      { text: `❌ *Error:* ${err.message}` },
      { quoted: m }
    );
    m.react('❌');
  }
};

handler.command = ['whatmusic'];
export default handler;
