let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  switch (type) {
  case 'welcome':
    case 'bv':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.bienvenida = isEnable
      break
  
    case 'document':
    case 'documento':
    isUser = true
    user.useDocument = isEnable
    break

      case 'modoadmin': case 'soloadmin':
      if (m.isGroup) {
      if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn)
      throw false
      }}
      chat.modoadmin = isEnable          
      break

      case 'detect': case 'avisos':
      if (!m.isGroup) {
      if (!isOwner) {
      global.dfail('group', m, conn)
      throw false
      }
      } else if (!isAdmin) {
      global.dfail('admin', m, conn)
      throw false
      }
      chat.detect = isEnable
      break
    
      case 'jadibotmd': case 'modojadibot': case 'serbotmd': case 'modoserbot': 
      isAll = true
      if (!isROwner) {
      global.dfail('rowner', m, conn)
      throw false
      }
      bot.jadibotmd = isEnable
      break 

      case 'autobiografia': case 'bio': case 'biografia': case 'status': 
      isAll = true
      if (!isROwner) {
      global.dfail('rowner', m, conn)
      throw false
      }
      bot.autobio = isEnable
      break 

      case 'antiprivado':
      isAll = true
      if (!isROwner) {
      global.dfail('rowner', m, conn)
      throw false
      }
      bot.antiPrivate = isEnable
      break

      case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break

      case 'audios':
      if (m.isGroup) {
      if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn)
      throw false
      }}
      chat.audios = isEnable          
      break
      
      case 'nsfw':
      case 'modohorny':
       if (m.isGroup) {
         if (!(isAdmin || isOwner)) {
           global.dfail('admin', m, conn)
            throw false
           }}
    chat.nsfw = isEnable          
    break
    default:
      if (!/[01]/.test(command)) return m.reply(`
*𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘶𝘯𝘢 𝘰𝘱𝘤𝘪𝘰́𝘯 𝘱𝘢𝘳𝘢 𝘈𝘤𝘵𝘪𝘷𝘢𝘳 𝘰 𝘋𝘦𝘴𝘢𝘤𝘵𝘪𝘷𝘢𝘳*

*≡ 𝘓𝘪𝘴𝘵𝘢 𝘥𝘦 𝘰𝘱𝘤𝘪𝘰𝘯𝘦𝘴*
*𝘛𝘪𝘱𝘰 :* 𝘸𝘦𝘭𝘤𝘰𝘮𝘦
*𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪𝘰́𝘯 :* 𝘋𝘦𝘴/𝘈𝘤𝘵𝘪𝘷𝘢 𝘭𝘢 *𝘉𝘪𝘦𝘯𝘷𝘦𝘯𝘪𝘥𝘢* 𝘺 *𝘋𝘦𝘴𝘱𝘦𝘥𝘪𝘥𝘢* 𝘱𝘢𝘳𝘢 𝘎𝘳𝘶𝘱𝘰𝘴.

*𝘛𝘪𝘱𝘰 :* 𝘮𝘰𝘥𝘰𝘢𝘥𝘮𝘪𝘯 
*𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪𝘰́𝘯 :* 𝘋𝘦𝘴/𝘈𝘤𝘵𝘪𝘷𝘢 𝘭𝘰𝘴 *𝘤𝘰𝘮𝘢𝘯𝘥𝘰𝘴* 𝘴𝘰𝘭𝘰 𝘱𝘢𝘳𝘢 𝘢𝘥𝘮𝘪𝘯𝘪𝘴𝘵𝘳𝘢𝘥𝘰𝘳𝘦𝘴.

*𝘛𝘪𝘱𝘰 :* 𝘥𝘦𝘵𝘦𝘤𝘵 
*𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪𝘰́𝘯 :* 𝘋𝘦𝘴/𝘈𝘤𝘵𝘪𝘷𝘢 𝘭𝘰𝘴 *𝘢𝘷𝘪𝘴𝘰𝘴* 𝘥𝘦𝘯𝘵𝘳𝘰 𝘥𝘦𝘭 𝘎𝘳𝘶𝘱𝘰.

*𝘛𝘪𝘱𝘰 :* 𝘢𝘶𝘥𝘪𝘰𝘴
*𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪𝘰́𝘯 :* 𝘋𝘦𝘴/𝘈𝘤𝘵𝘪𝘷𝘢 𝘭𝘰𝘴 𝘢𝘶𝘥𝘪𝘰𝘴 𝘱𝘢𝘳𝘢 𝘎𝘳𝘶𝘱𝘰𝘴.

*𝘛𝘪𝘱𝘰 :* 𝘯𝘴𝘧𝘸 
*𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪𝘰́𝘯 :* 𝘋𝘦𝘴/𝘈𝘤𝘵𝘪𝘷𝘢 𝘭𝘰𝘴 𝘤𝘰𝘮𝘢𝘯𝘥𝘰𝘴 *𝘕𝘚𝘍𝘞* 𝘱𝘢𝘳𝘢 𝘎𝘳𝘶𝘱𝘰𝘴.

*𝘛𝘪𝘱𝘰 :* 𝘢𝘯𝘵𝘪𝘭𝘪𝘯𝘬 
*𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪𝘰́𝘯 :* 𝘋𝘦𝘴/𝘈𝘤𝘵𝘪𝘷𝘢 𝘦𝘭 *𝘈𝘯𝘵𝘪𝘓𝘪𝘯𝘬* 𝘱𝘢𝘳𝘢 𝘎𝘳𝘶𝘱𝘰𝘴.

*𝘛𝘪𝘱𝘰 :* 𝘥𝘰𝘤𝘶𝘮𝘦𝘯𝘵 
*𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪𝘰́𝘯 :* 𝘋𝘦𝘴/𝘈𝘤𝘵𝘪𝘷𝘢 𝘭𝘢 *𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢 𝘌𝘯 𝘋𝘰𝘤𝘶𝘮𝘦𝘯𝘵𝘰𝘴* 𝘱𝘢𝘳𝘢 𝘦𝘭 𝘜𝘴𝘶𝘢𝘳𝘪𝘰.

*𝘛𝘪𝘱𝘰 :* 𝘢𝘯𝘵𝘪𝘱𝘳𝘪𝘷𝘢𝘥𝘰
*𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘤𝘪𝘰́𝘯 :* 𝘋𝘦𝘴/𝘈𝘤𝘵𝘪𝘷𝘢 𝘌𝘭 𝘶𝘴𝘰 𝘥𝘦𝘭 𝘉𝘰𝘵 𝘢𝘭 𝘗𝘳𝘪𝘷𝘢𝘥𝘰/ 𝘱𝘢𝘳𝘢 𝘦𝘭 𝘖𝘸𝘯𝘦𝘳.

*• 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:*
*- ${usedPrefix + command}* welcome
`.trim())
      throw false
  }
  m.reply(`🫧 𝘓𝘢 𝘧𝘶𝘯𝘤𝘪𝘰́𝘯 *${type}* 𝘴𝘦 *${isEnable ? '𝘈𝘤𝘵𝘪𝘷𝘰́' : '𝘋𝘦𝘴𝘢𝘤𝘵𝘪𝘷𝘰́'}* ${isAll ? '𝘌𝘯 𝘦𝘴𝘵𝘦 𝘉𝘰𝘵' : isUser ? '' : '𝘌𝘯 𝘦𝘴𝘵𝘦 𝘊𝘩𝘢𝘵'}`)
}

handler.help = ['enable', 'disable']
handler.tags = ['nable']
handler.command = /^(enable|disable|on|off|1|0)$/i

export default handler
