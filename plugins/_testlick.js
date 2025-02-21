let handler = async (m, { conn }) => {
    if (!m.mentionedJid[0]) return m.reply('Debes mencionar a alguien para follar');

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

    // Arreglo con URLs de videos
    const videos = [
        'https://files.catbox.moe/8wgme9.mp4',
        'https://files.catbox.moe/akh0e1.mp4',
        'https://files.catbox.moe/2sletl.mp4'
    ];
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    // Enviar el mensaje con el video
    await conn.sendMessage(m.chat, {
        video: { url: randomVideo },
        caption: `🥵 *${senderName}* se folló a *${mentionedName}* 💦`,
        gifPlayback: true, // Reproducción automática si es un gif animado
        mentions: [senderJid, mentionedJid]
    }, { quoted: m });
};

handler.command = ['follar'];
export default handler;
                
