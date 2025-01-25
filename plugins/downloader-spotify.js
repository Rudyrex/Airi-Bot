
import { apis } from '../exports.js';
import fetch from 'node-fetch';

const handler = async (m, { conn, args, command, usedPrefix }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `_*[ ⚠️ ] Agrega un enlace de Spotify*_`, m);
    }

    try {

        await conn.reply(m.chat, `_*[ ⏳ ] Descargando mp3...*_`, m);
        
        if (command==='spotifydl') {
            const apiUrl = `${apis.delirius}download/spotifydl?url=${encodeURIComponent(args[0])}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.data && data.data.url) {
                const downloadUrl = data.data.url;
                const filename = `${data.data.title || 'audio'}.mp3`;
                const thumb = data.data.image;
                await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, fileName: filename, mimetype: 'audio/mpeg', caption: `╭━❰  *SPOTIFY*  ❱━⬣\n${filename}\n╰━❰ *${botname}* ❱━⬣`, quoted: m })
                //await conn.sendFile(m.chat, downloadUrl, filename, `Titulo: ${filename}`, m);
            } else {
                throw new Error('_*[ ❌ ] Ocurrió un error al descargar el  archivo mp3_');
            }
        }
        
        if (command==='dlspotifydoc'){
            const apiUrl = `${apis.delirius}download/spotifydl?url=${encodeURIComponent(args[0])}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.data && data.data.url) {
                const downloadUrl = data.data.url;
                const filename = `${data.data.title || 'audio'}.mp3`;
                const thumb = data.data.image;
                await conn.sendMessage(m.chat, { document: { url: downloadUrl }, fileName: filename, mimetype: 'audio/mpeg', caption: `╭━❰  *SPOTIFY*  ❱━⬣\n${filename}\n╰━❰ *${botname}* ❱━⬣`, quoted: m })
                //await conn.sendFile(m.chat, downloadUrl, filename, `Titulo: ${filename}`, m);
            } else {
                throw new Error('_*[ ❌ ] Ocurrió un error al descargar el  archivo mp3_');
            }
        }
    } catch (err) {
        console.error(err);
        await conn.reply(m.chat, `_*[ ❌ ] Ocurrió un error al descargar el archivo mp3, inténtalo más tarde*_`, m);
    }
};

handler.command = ['spotifydl', 'dlspotifydoc'];
export default handler;
