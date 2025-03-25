let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
    let kickte = `${em} *Menciona al usuario que deseas eliminar*`

    // Verifica si se mencionó un usuario o si se respondió a un mensaje.
    if (!m.mentionedJid[0] && !m.quoted) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte)}) 

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
    let botNumber = conn.user.jid.split('@')[0]  // Obtiene el número del bot
    let creatorNumber = '50375961083';

    // Verifica si el usuario a expulsar es el bot
    if (user.includes(botNumber)) {
        return m.reply(`${em} *No puedo expulsarme a mí*`);
    }

    if (user.includes(creatorNumber)) {
        return m.reply(`${em} *No puedo expulsar a mí creador*`);
    }

    // Realiza la acción de expulsión
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    m.reply(`${em} *Miembro eliminado*`)
}


handler.command = ['kick', 'expulsar'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

	
