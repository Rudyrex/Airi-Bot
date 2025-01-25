
import { apis } from '../exports.js';
import fetch from 'node-fetch';
import { ytmp4 } from 'ruhend-scraper';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return await conn.reply(m.chat, `⚠️ Agrega un enlace de *YouTube*`, m);

    let yturl = args[0];
    m.react('⏳');
    await conn.reply(m.chat, '⏳ Intentando descargar el video...', m);

    try {
        // Primer intento: API principal
        let api1 = await fetch(`${apis.delirius}download/ytmp4?url=${yturl}`);
        let result1 = await api1.json();

        if (result1.data && result1.data.title && result1.data.download && result1.data.download.url) {
            let title1 = result1.data.title;
            let downloadUrl1 = result1.data.download.url;

            await m.react('✅');
            await conn.sendMessage(m.chat, {
                document: { url: downloadUrl1 },
                caption: null,
                mimetype: 'video/mp4',
                fileName: `${title1}.mp4`
            }, { quoted: m });
            return;
        } else {
            throw new Error('API principal no devolvió resultados válidos.');
        }
    } catch (e1) {
        // Si falla la API principal, intentamos con ruhend-scraper
        try {
            await m.react('🔄');
            await conn.reply(m.chat, '⏳ Intentando con método alternativo...', m);

            const data = await ytmp4(yturl);

            if (data && data.title && data.video) {
                let { title, video } = data;

                await m.react('✅');
                await conn.sendMessage(m.chat, {
                    document: { url: video },
                    caption: null,
                    mimetype: 'video/mp4',
                    fileName: `${title}.mp4`
                }, { quoted: m });
            } else {
                throw new Error('No se pudo obtener información del video con el método alternativo.');
            }
        } catch (e2) {
            // Si ambos métodos fallan
            await m.react('❌');
            await conn.reply(m.chat, `⚠️ Error: No se pudo descargar el video.\nDetalles:\n- API: ${e1.message}\n- Alternativo: ${e2.message}`, m);
        }
    }
};

handler.command = ['ytvdoc', 'ytmp4doc'];
export default handler;



/*
import fetch from 'node-fetch';


let handler = async (m, { text, conn, args, usedPrefix, command }) => {
    
    if (!args[0]) return await conn.reply(m.chat, `⚠️ Agrega un enlace de *YouTube*`, m);
    let yturl = args[0]
    m.react('⏳')
    conn.reply(m.chat, '⏳ Descargando el video...', m);
    
    try {
        let api1 = await fetch(`https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${yturl}`)    
        let result1 = await api1.json()
        let title1 = result1.data.title;
        let downloadUrl1 = result1.data.download.url;
        
        await m.react('✅')
        await conn.sendMessage(m.chat, {document: {url: downloadUrl1}, caption: null, mimetype: 'video/mp4', fileName: `${title1}.mp4`}, {quoted: m});
        
    } catch (e1) {
        await conn.reply(m.chat, e1.message, m);
    }
};

handler.command = ['ytvdoc', 'ytmp4doc',];
export default handler;
*/
