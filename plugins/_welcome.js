import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;
  
  let top = `*╭─${em}─── ⫍📢⫎ ───${em}─╮*\n`;
  let bottom = `\n*╰─${em}─── ⫍📢⫎ ───${em}─╯*`;
  //let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/jYQH.jpg')
  //let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
    }

  if (chat.bienvenida && m.messageStubType == 27) {
    if (chat.sWelcome) {
      let user = `@${m.messageStubParameters[0].split`@`[0]}`
      let welcome = chat.sWelcome.replace('@user', () => user);
      
      await conn.reply(m.chat, welcome, fkontak);
    } else {
      let welcome = `${top}_🥳 @${m.messageStubParameters[0].split`@`[0]} Bienvenid@ al grupo *${groupMetadata.subject}*_${bottom}`;
      
      await conn.reply(m.chat, welcome, fkontak);
    }
  }
  
  if (chat.bienvenida && m.messageStubType == 28) {
    if (chat.sBye) {
      let user = `@${m.messageStubParameters[0].split`@`[0]}`
      let bye = chat.sBye.replace('@user', () => user);
      
      await conn.reply(m.chat, bye, fkontak);
    } else {
      let bye = `${top}_👋 @${m.messageStubParameters[0].split`@`[0]} Ha abandonado el grupo_${bottom}`;
      
      await conn.reply(m.chat, bye, fkontak);
    }
  }
  
  if (chat.bienvenida && m.messageStubType == 32) {
    if (chat.sBye) {
      let user = `@${m.messageStubParameters[0].split`@`[0]}`
      let kick = chat.sBye.replace('@user', () => user);
      
      await conn.reply(m.chat, kick, fkontak);
    } else {
      let kick = `${top}_☠️ @${m.messageStubParameters[0].split`@`[0]} Fue expulsad@ del grupo_${bottom}`;
      
      await conn.reply(m.chat, kick, fkontak);
    }
}}
