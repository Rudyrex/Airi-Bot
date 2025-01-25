

import fetch from 'node-fetch';


let handler = async (m, { text, conn, args, usedPrefix, command }) => {
    
    if (!args[0]) return await conn.reply(m.chat, `⚠️ Agrega un enlace de *YouTube*`, m);
    let yturl = args[0]
    m.react('⏳')
    conn.reply(m.chat, '⏳ Descargando el audio...', m);
    
    try {
        let api1 = await fetch(`https://deliriussapi-oficial.vercel.app/download/ytmp3?url=${yturl}`)    
        let result1 = await api1.json();
        let title1 = result1.data.title;
        let downloadUrl1 = result1.data.download.url;
        
        await m.react('✅')
        await conn.sendMessage(m.chat, {audio: {url: downloadUrl1}, caption: null, mimetype: 'audio/mpeg', fileName: `${title1}.mp3`}, {quoted: m});
        
    } catch (e1) {
        m.react('❌')
        await conn.reply(m.chat, e2.message, m);
    }
};

handler.command = ['ytmp3', 'yta',];
export default handler;
