
import { apis } from '../exports.js';
import fetch from 'node-fetch';

const handler = async (m, { conn, args, command, usedPrefix }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `_*[ ⚠️ ] Agrega un enlace de Spotify*_`, m);
    }

    const url = args[0];
    m.react('⏳');
    try {
        
        const api1 = `${apis.delirius}download/spotifydl?url=${encodeURIComponent(url)}`;
        const response1 = await fetch(api1);
        const result1 = await response1.json();
        const downloadUrl1 = result1.data.url;
        await conn.sendMessage(m.chat, { audio: { url: downloadUrl1 }, fileName: 'audio.mp3', mimetype: 'audio/mpeg', caption: null, quoted: m });
        
    } catch (e1) {
        try {
            
            const api2 = `${apis.delirius}download/spotifydlv3?url=${encodeURIComponent(url)}`;
            const response2 = await fetch(api2);
            const result2 = await response2.json();
            const downloadUrl2 = result2.data.url;
            await conn.sendMessage(m.chat, { audio: { url: downloadUrl2 }, fileName: 'audio.mp3', mimetype: 'audio/mpeg', caption: null, quoted: m });
            
        } catch (e2) {
            try {
                
                const api3 = `${apis.rioo}api/spotify?url=${encodeURIComponent(url)}`;
                const response3 = await fetch(api3);
                const result3 = await response3.json();
                const downloadUrl3 = result3.data.response;
                await conn.sendMessage(m.chat, { audio: { url: downloadUrl3 }, fileName: 'audio.mp3', mimetype: 'audio/mpeg', caption: null, quoted: m });
                
            } catch (e3) {
                try {
                    const api4 = `${apis.ryzen}api/downloader/spotify?url=${encodeURIComponent(url)}`;
                    const response4 = await fetch(api4);
                    const result4 = await response4.json();
                    const downloadUrl4 = result4.link;
                    await conn.sendMessage(m.chat, { audio: { url: downloadUrl4 }, fileName: 'audio.mp3', mimetype: 'audio/mpeg', caption: null, quoted: m });
                } catch (e4) {
                        
                        console.log(e4);
                        m.react('❌');
                        conn.reply(m.chat, `*[ ❌ ]* Ocurrió un error al descargar el archivo mp3, inténtalo más tarde\nError:${e4}`, m);
                        
                }
            }
        }
    }
};

handler.command = ['spotifydl', 'dlspotify', 'sfdl', 'dlsf'];
export default handler;
