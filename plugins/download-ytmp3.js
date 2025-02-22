import fetch from 'node-fetch';
import { toAudio } from '../lib/converter.js';
import { apis } from '../exports.js';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return await conn.reply(m.chat, `${em} Agrega un enlace de YouTube`, m);

    let yturl = args[0];
    m.react('⏳');

    try {
        // Descarga el video usando la API
        let response = await fetch(`${apis.random1}youtube-video?url=${yturl}`);
        let result = await response.json();

        if (!result.result || !result.result.downloadUrl) throw new Error('No se pudo obtener el enlace de descarga');
        
        let downloadUrl = result.result.downloadUrl;
        let title = result.result.title || 'audio';

        // Descarga el archivo de video
        let videoResponse = await fetch(downloadUrl);
        let videoBuffer = await videoResponse.buffer();

        // Convierte el video a audio
        let audio = await toAudio(videoBuffer, 'mp4');

        await m.react('✅');
        await conn.sendFile(m.chat, audio.data, `${title}.mp3`, `🎵 *${title}*`, m, null, { mimetype: 'audio/mp4' });
    } catch (e) {
        console.error(e);
        await m.react('❌');
        //await conn.reply(m.chat, `${em} Error al procesar el enlace.`, m);
    }
};

handler.command = ['yta', 'ytmp3'];
export default handler;
            
