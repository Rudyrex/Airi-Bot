let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
    let kickte = `_Menciona al usuario que deseas eliminar._`

    // Verifica si se mencionó un usuario o si se respondió a un mensaje.
    if (!m.mentionedJid[0] && !m.quoted) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte)}) 

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
    let botNumber = conn.user.jid.split('@')[0]  // Obtiene el número del bot

    // Verifica si el usuario a expulsar es el bot
    if (user.includes(botNumber)) {
        return m.reply(`⚠️ No puedo expulsarme a mí mismo.`);
    }

    // Realiza la acción de expulsión
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    m.reply(`🍭 Usuario eliminado.`)
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'expulsar', 'eliminar'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler
	
