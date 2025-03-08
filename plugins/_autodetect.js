let WAMessageStubType = (await import(global.baileys)).default
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs';
import path from 'path';

export async function before(m, { conn, participants}) {
    if (!m.messageStubType || !m.isGroup) return
    let usuario = `@${m.sender.split`@`[0]}`
    let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
    let chat = global.db.data.chats[m.chat]
    let users = participants.map(u => conn.decodeJid(u.id))
    const groupAdmins = participants.filter(p => p.admin)
    const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')
/*if (chat.detect && m.messageStubType == 2) {
const chatId = m.isGroup ? m.chat : m.sender;
const uniqid = chatId.split('@')[0];
const sessionPath = './sessions/';
const files = await fs.readdir(sessionPath);
let filesDeleted = 0;
for (const file of files) {
if (file.includes(uniqid)) {
await fs.unlink(path.join(sessionPath, file));
filesDeleted++;
console.log(`⚠️ Eliminacion session (PreKey) que provocan el undefined el chat`)}}*/

    if (chat.detect && m.messageStubType == 21) {
        await this.sendMessage(m.chat, { text: `${em} *${usuario}* _Cambió el nombre del grupo a:_ *${m.messageStubParameters[0]}*`, mentions: [m.sender], mentions: [...groupAdmins.map(v => v.id)] }, { quoted: fkontak}) 
    } else if (chat.detect && m.messageStubType == 22) {
        await this.sendMessage(m.chat, { text: `${em} *${usuario}* _Cambió el icono del grupo_`, mentions: [m.sender] }, { quoted: fkontak}) 
    } else if (chat.detect && m.messageStubType == 24) {
        await this.sendMessage(m.chat, { text: `${em} *${usuario}* _Ha actualizado la descripción del grupo a:_\n\n${m.messageStubParameters[0]}`, mentions: [m.sender] }, { quoted: fkontak})
    } else if (chat.detect && m.messageStubType == 25) {
        await this.sendMessage(m.chat, { text: `${em} _Ahora_ _${m.messageStubParameters[0] == 'on' ? 'Solo admins' : 'Todos'}_ _pueden editar la información del grupo_`, mentions: [m.sender] }, { quoted: fkontak})
    } else if (chat.detect && m.messageStubType == 26) {
        await this.sendMessage(m.chat, { text: `${em} _Grupo_ _${m.messageStubParameters[0] == 'on' ? 'cerrado 🔒' : 'abierto 🔓'}_\n ${m.messageStubParameters[0] == 'on' ? '_Solo admins pueden escribir' : 'Ya todos pueden escribir'}_`, mentions: [m.sender] }, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 29) {
        await this.sendMessage(m.chat, { text: `${em} *@${m.messageStubParameters[0].split`@`[0]}* _ha sido asignado como administrador por_ *${usuario}*`, mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)] }, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 30) {
        await this.sendMessage(m.chat, { text: `${em} *@${m.messageStubParameters[0].split`@`[0]}* _Ha sido removido como administrador por_ *${usuario}*`, mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)] }, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 72) {
        await this.sendMessage(m.chat, { text: `${em} *${usuario}* _Cambió la duración de los mensajes temporales a:_ *@${m.messageStubParameters[0]}*`, mentions: [m.sender] }, { quoted: fkontak })
    } else if (chat.detect && m.messageStubType == 123) {
        await this.sendMessage(m.chat, { text: `${em} *${usuario}* _Ha desactivado los mensajes temporales_`, mentions: [m.sender] }, { quoted: fkontak })
    } else {
        console.log({messageStubType: m.messageStubType, messageStubParameters: m.messageStubParameters, type: WAMessageStubType[m.messageStubType]})
    }
}
