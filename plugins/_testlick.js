
let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
    
    if (chat.nsfw) {
    
    const mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted?.sender;
    
    if (!mentionedJid) return m.reply(`${em} *Debes mencionar o etiquetar a alguien para follar*`);

    const senderJid = m.sender;

    // Función para obtener el nombre del usuario
    async function getUserName(conn, jid) {
        // Intenta obtener el nombre del objeto global
        let name = global.db.data.users[jid]?.name;
        // Si no se encuentra, intenta usar la API de conexión
        if (!name) {
            name = await conn.getName(jid);
            // Si aún no se encuentra, intenta obtener desde el contacto
            if (!name) {
                const contact = await conn.fetchContact(jid);
                name = contact?.notify || contact?.name || jid.split('@')[0];
            }
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
    } else {
        m.reply(`${em} *Los comandos +18 estan desactivados*`);
    }
};

handler.command = ['fuck', 'follar'];
export default handler;
    
