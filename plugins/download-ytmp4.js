import { apis } from '../exports.js';
import fetch from 'node-fetch';


let handler = async (m, { text, conn, args, usedPrefix, command }) => {
    
    if (!args[0]) return await conn.reply(m.chat, `${em} Agrega un enlace de Youtube`, m);
    let yturl = args[0]
    m.react('⏳')
    
    try {
        let api1 = await fetch(`${apis.random1}youtube-video?url=${yturl}`)    
        let result1 = await api1.json()
        let downloadUrl1 = result1.result.downloadUrl;
        let title1 = result1.result.title
        
        await conn.sendMessage(m.chat, {document: {url: downloadUrl1}, caption: null, mimetype: 'video/mp4', fileName: `${title1}.mp4`}, {quoted: m});
    } catch (e1) {
        m.react('❌')
    }
};

handler.command = ['ytv', 'ytmp4', 'ytvdoc'];
export default handler;
