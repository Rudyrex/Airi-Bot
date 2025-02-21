import fs from 'fs';

let handler = async (m, { conn }) => {
    if (!m.mentionedJid[0]) return m.reply('Debes mencionar a alguien para lamer');

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

    // Cargar el JSON y obtener un video aleatorio
    const jsonData = JSON.parse(fs.readFileSync('../src/json/nsfw/lick.json', 'utf-8'));
    const videos = jsonData.videos; // Cambié "images" por "videos" para mayor claridad
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    // Enviar el mensaje con el video, mostrando solo el nombre pero mencionando internamente
    await conn.sendMessage(m.chat, {
        video: { url: randomVideo },
        caption: `✨ *${senderName}* lamió a *${mentionedName}* 🐾`,
        gifPlayback: true, // Si es un video tipo GIF, se reproducirá automáticamente
        mentions: [senderJid, mentionedJid]
    }, { quoted: m });
};

handler.command = ['lick'];
export default handler;
                       
