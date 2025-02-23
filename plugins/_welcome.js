import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

// Función para obtener el nombre del usuario
async function getUserName(conn, jid) {
  let name = await conn.getName(jid);
  if (!name) {
    const contact = await conn.fetchContact(jid);
    name = contact?.notify || contact?.name || jid.split('@')[0];
  }
  return name;
}

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let top = `*╭─${em}─── ⫍📢⫎ ───${em}─╮*\n`;
  let bottom = `\n*╰─${em}─── ⫍📢⫎ ───${em}─╯*`;
  let chat = global.db.data.chats[m.chat];

  // Obtener foto de perfil
  let pp = await conn
    .profilePictureUrl(m.messageStubParameters[0], 'image')
    .catch(() => 'https://files.catbox.moe/f2lebz.jpg');
  let thumb = await (await fetch(pp)).buffer();

  // Obtener nombre del usuario
  const userJid = m.messageStubParameters[0];
  const userName = await getUserName(conn, userJid);

  if (chat.bienvenida && m.messageStubType == 27) {
    let welcome = chat.sWelcome
      ? chat.sWelcome.replace('@user', userName)
      : `${top}_🙂 Hola *${userName}* Bienvenid@ al grupo *${groupMetadata.subject}*_${bottom}`;

    await conn.sendAiri(m.chat, botname, botdesc, welcome, true, thumb, null, null);
  }

  if (chat.bienvenida && m.messageStubType == 32) {
    let bye = chat.sBye
      ? chat.sBye.replace('@user', userName)
      : `${top}_👋 *${userName}* Ha abandonado el grupo_${bottom}`;

    await conn.sendAiri(m.chat, botname, botdesc, bye, true, thumb, null, null);
  }

  if (chat.bienvenida && m.messageStubType == 28) {
    let kick = chat.sBye
      ? chat.sBye.replace('@user', userName)
      : `${top}_☠️ *${userName}* Fue expulsad@ del grupo_${bottom}`;

    await conn.sendAiri(m.chat, botname, botdesc, kick, true, thumb, null, null);
  }
} 
		       
