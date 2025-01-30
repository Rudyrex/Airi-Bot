import fetch from 'node-fetch';
import { apis } from '../exports.js';

let handler = m => m

handler.all = async function (m, {conn, text}) {
let chat = global.db.data.chats[m.chat]
    
try {
    if (m.mentionedJid.includes(this.user.jid) && m.isGroup && !chat.isBanned) {
        let gpt = await fetch(`${apis.delirius}ia/gptweb?text=${text}`)
        let res = await msg.json()
        await m.reply(res.data)
    } else {

        if (!m.fromMe && m.text.match(/airi/gi)) {
            let gpt = await fetch(`${apis.delirius}ia/gptweb?text=${text}`)
            let res = await msg.json()
            await m.reply(res.data)
        }
    }
} catch (e){
    m.reply(`Error: ${e.message}`);
}

return !0 }
export default handler
