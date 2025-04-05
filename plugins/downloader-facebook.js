import fetch from 'node-fetch';
import facebookDownloader from '../lib/fbscrape.js';

let handler = async (m, { args, conn }) => {
    if (!args[0]) return await conn.reply(m.chat, `⚠️ *Agrega un enlace de Facebook*`, m);

    const fburl = args[0];
    m.react('⏳');

    try {
        let id = null;
        let shortLink = null;

        if (fburl.includes('fb.watch')) {
            shortLink = fburl.split('/').filter(x => x).pop();
        } else {
            const match = fburl.match(/(?:\/videos\/|\/reel\/|\/watch\/|\?v=)([0-9]+)/);
            id = match?.[1];
        }

        if (!id && !shortLink) {
            throw new Error('No se pudo extraer el ID o shortLink del enlace');
        }

        const result = await facebookDownloader({ id, shortLink });

        if (result.error) {
            throw new Error(`Error al obtener el video: ${result.error}`);
        }

        const videoUrl = result.urls;
        if (!videoUrl) {
            throw new Error('No se pudo obtener la URL del video');
        }

        await m.react('✅');
        await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            fileName: 'facebook.mp4',
            mimetype: 'video/mp4',
            caption: null
        }, { quoted: m });

    } catch (err) {
        console.log(err);
        await m.react('❌');
        await conn.reply(m.chat, `❌ *No se pudo descargar el video*\n${err.message}`, m);
    }
};

handler.command = ['facebook', 'fb', 'fbdl'];
export default handler;
    
