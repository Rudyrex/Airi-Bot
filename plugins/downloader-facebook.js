
import fetch from 'node-fetch';
import { apis } from '../exports.js';

let handler = async (m, { text, conn, args, usedPrefix, command }) => {
    
    if (!args[0]) return await conn.reply(m.chat, `⚠️ Agrega un enlace de *Facebook*`, m);
    let fburl = args[0]
    m.react('🔥')
    
    try {
        let api1 = await fetch(`${apis.delirius}download/facebook?url=${fburl}`);
        let result1 = await api1.json()
        let downloadUrl1 = result1.urls[0].hd || result1.urls[1].sd;
        
        
        await await conn.sendMessage(m.chat, { video: { url: downloadUrl1 }, fileName: `Facebook.mp4`, mimetype: 'video/mp4', caption: null }, { quoted: m });
    } catch (e1) {
        try {

        } catch (e2) {
            await conn.reply(m.chat, e2.message, m);
        }
                
    }
};

handler.command = ['facebook', 'fb', 'fbdl'];
export default handler;
                                                 
