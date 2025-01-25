
import { getRandomIcon } from '../exports.js';
import { getRandomThumb } from '../exports.js';



let handler = async (m, { conn }) => {
    try {
    let icon = getRandomThumb();
    let name = await conn.getName(m.sender)
    let text = `Hola 🐼`.trim()
    
    m.reply(icon);
    //await conn.sendAiri(m.chat, text, 'Titulo de prueba', 'Descripcion de prueba', true, icon, icon, m);
        
        await conn.sendAiri(
    m.chat,
    'Título de Prueba',
    'Descripción de Prueba',
    'Texto Opcional',
    true,
    icon, // URL de la imagen como thumbnail
    null, // Fuente del enlace
    m);
    
        
    //conn.reply(m.chat, menu, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: '✿ 𝐀𝐢𝐫𝐢 ✿', body: '𝙴𝚕 𝚖𝚎𝚓𝚘𝚛 𝚋𝚘𝚝 𝚍𝚎 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 ✅', previewType: 0, "renderLargerThumbnail": true, thumbnail: thumb, sourceurl: thumb}}});
    } catch (e) {
        m.reply(e.message)
    }
 }
handler.command = ['menu2', 'help2']
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
    
