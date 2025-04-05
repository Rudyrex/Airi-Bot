import fetch from 'node-fetch';
import facebookDownloader from '../lib/fbscrape.js';

let handler = async (m, { args, conn }) => {
    if (!args[0]) return await conn.reply(m.chat, `${em} *Agrega un enlace de Facebook*`, m);

    const fburl = args[0];
    m.react('⏳');

    try {
        // Extraer ID o shortlink del enlace
        const match = fburl.match(/(?:\/videos\/|\/reel\/|\/watch\/|\?v=)([0-9A-Za-z_-]+)/);
        const id = match ? match[1] : null;
        const shortLink = fburl.includes('fb.watch') ? fburl.split('/').pop() : null;

        const result = await facebookDownloader({ id, shortLink });

        if (result.error) {
            throw new Error(`Error al obtener el video: ${result.error}`);
        }

        const videoUrl = result.urls;
        await m.react('✅');
        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            fileName: 'video.mp4',
            mimetype: 'video/mp4',
            caption: null
        }, { quoted: m });

    } catch (err) {
        console.log(err);
        await m.react('❌');
        await conn.reply(m.chat, `${em} *No se pudo descargar el video*\n${err.message}`, m);
    }
};

handler.command = ['facebook', 'fb', 'fbdl'];
export default handler;
        
