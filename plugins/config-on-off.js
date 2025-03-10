let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command);
  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let bot = global.db.data.settings[conn.user.jid] || {};
  let type = (args[0] || '').toLowerCase();
  let isAll = false, isUser = false;

  const funciones = {
    welcome: { desc: "Bienvenida y despedida para grupos", estado: chat.bienvenida },
    document: { desc: "Descarga en documentos para el usuario", estado: user.useDocument },
    modoadmin: { desc: "Comandos solo para administradores", estado: chat.modoadmin },
    detect: { desc: "Avisos dentro del grupo", estado: chat.detect },
    jadibotmd: { desc: "Modo SerBot", estado: bot.jadibotmd },
    autoread: { desc: "Lectura automática de mensajes", estado: global.opts['autoread'] },
    autobiografia: { desc: "Actualización automática de biografía", estado: bot.autobio },
    antiprivado: { desc: "Bloqueo de mensajes privados", estado: bot.antiPrivate },
    antilink: { desc: "AntiLinks en el grupo", estado: chat.antiLink },
    audios: { desc: "Audios en el grupo", estado: chat.audios },
    nsfw: { desc: "Modo NSFW para grupos", estado: chat.nsfw },
  };

  if (!type) {
    let lista = Object.keys(funciones).map(key => 
      `*Nombre:* _${key}_\n*Estado:* _${funciones[key].estado ? 'Activado' : 'Desactivado'}_\n*Descripción:* _${funciones[key].desc}_`
    ).join('\n\n');

    return m.reply(`🌱 *Agrega el nombre de la función que deseas activar o desactivar*\n\n*Ejemplo:*\n_.on welcome_\n\n*≡ Lista de funciones disponibles*\n\n${lista}`);
  }

  if (!funciones[type]) return m.reply(`⚠️ La función *${type}* no existe en la lista de opciones.`);

  let estadoActual = funciones[type].estado;
  if (estadoActual === isEnable) {
    return m.reply(`⚠️ La función *${type}* ya está ${isEnable ? 'activada' : 'desactivada'}.`);
  }

  switch (type) {
    case 'welcome':
      if (!m.isGroup && !isOwner) return global.dfail('group', m, conn);
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn);
      chat.bienvenida = isEnable;
      break;

    case 'document':
      isUser = true;
      user.useDocument = isEnable;
      break;

    case 'modoadmin':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn);
      chat.modoadmin = isEnable;
      break;

    case 'detect':
      if (!m.isGroup && !isOwner) return global.dfail('group', m, conn);
      if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn);
      chat.detect = isEnable;
      break;

    case 'jadibotmd':
      isAll = true;
      if (!isROwner) return global.dfail('rowner', m, conn);
      bot.jadibotmd = isEnable;
      break;

    case 'autoread':
    case 'autoleer':
    case 'autover':
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['autoread'] = isEnable;
      break;
      
    case 'autobiografia':
      isAll = true;
      if (!isROwner) return global.dfail('rowner', m, conn);
      bot.autobio = isEnable;
      break;

    case 'antiprivado':
      isAll = true;
      if (!isROwner) return global.dfail('rowner', m, conn);
      bot.antiPrivate = isEnable;
      break;

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn);
      chat.antiLink = isEnable;
      break;

    case 'audios':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn);
      chat.audios = isEnable;
      break;

    case 'nsfw':
      if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn);
      chat.nsfw = isEnable;
      break;
  }

  m.reply(`✅ La función *${type}* se ha *${isEnable ? 'activado' : 'desactivado'}* ${isAll ? 'en el bot' : isUser ? 'para ti' : 'en este chat'}.`);
};

handler.help = ['enable', 'disable'];
handler.tags = ['nable'];
handler.command = /^(enable|disable|on|off|1|0)$/i;

export default handler;
    
