import fetch from 'node-fetch';
import { apis } from '../exports.js';

let handler = m => m

handler.all = async function (m, {conn, text}) {
let chat = global.db.data.chats[m.chat]
    
try {
    if (m.mentionedJid.includes(this.user.jid) && m.isGroup && !chat.isBanned) {
        let gpt = await fetch(`${apis.ryzen}api/ai/blackbox?chat=${encodeURIComponent(text)}&options=gpt-4o`)
        let res = await gpt.json()
        await m.reply(res.data)
    } else {

        if (!m.fromMe && m.text.match(/airi/gi)) {
            let gpt = await fetch(`${apis.ryzen}api/ai/blackbox?chat=${encodeURIComponent(text)}&options=gpt-4o`)
            let res = await gpt.json()
            await m.reply(res.data)
        }
    }
} catch (e){
    m.reply(`Error: ${e.message}`);
}

return !0 }
export default handler
