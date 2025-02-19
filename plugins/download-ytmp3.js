import { apis } from '../exports.js';
import fetch from 'node-fetch';


let handler = async (m, { text, conn, args, usedPrefix, command }) => {
    
    if (!args[0]) return await conn.reply(m.chat, `${em} Agrega un enlace de Youtube`, m);
    let yturl = args[0]
    m.react('⏳')
    
    try {
        let api1 = await fetch(`${apis.random1}youtube-audio?url=${yturl}`)    
        let result1 = await api1.json()
        let downloadUrl1 = result1.result.downloadUrl;
        
        await conn.sendMessage(m.chat, {document: {url: downloadUrl1}, caption: null, mimetype: 'audio/mpeg', fileName: `audio.mp3`}, {quoted: m});
    } catch (e1) {
        m.react('❌')
    }
};

handler.command = ['yta', 'ytmp3', 'ytadoc'];
export default handler;
