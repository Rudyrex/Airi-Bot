let handler = async (m, { conn }) => {
    if (!m.mentionedJid[0]) return m.reply('Debes mencionar a alguien para acariciar.');

    const senderJid = m.sender;
    const mentionedJid = m.mentionedJid[0];

    // Función para obtener el nombre del usuario
    async function getUserName(conn, jid) {
        let name = await conn.getName(jid);
        if (!name) {
            const contact = await conn.fetchContact(jid);
            name = contact?.notify || contact?.name || jid.split('@')[0];
        }
        return name;
    }

    const senderName = await getUserName(conn, senderJid);
    const mentionedName = await getUserName(conn, mentionedJid);

    m.reply(`✨ *${senderName}* acarició a *${mentionedName}* 🐾`);
};

handler.command = ['acariciar'];
export default handler;
