import fetch from 'node-fetch';
import { ytmp4 } from 'ruhend-scraper';
import { toAudio } from '../lib/converter.js';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return await conn.reply(m.chat, `${em} Agrega un enlace de YouTube`, m);

    let yturl = args[0];
    m.react('⏳');
    
    try {
        const data = await ytmp4(yturl);
        if (data && data.title && data.video) {
            let { title, video } = data;

            let res = await fetch(video);
            let buffer = await res.buffer();

            let audio = await toAudio(buffer, 'mp4');

            await m.react('✅');
            await conn.sendFile(m.chat, audio.data, `${title}.mp3`, `🎵 *${title}*`, m, null, { mimetype: 'audio/mp4' });
        }
    } catch (e) {
        await m.react('❌');
        
    }
};

handler.command = ['yta', 'ytmp3'];
export default handler;
            
