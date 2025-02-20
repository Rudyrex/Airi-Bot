import axios from 'axios';

let handler = async (m, { conn }) => {
    if (!m.mentionedJid[0]) return m.reply('Debes mencionar a alguien para lamer.');

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

    // Obtener el GIF desde la API
    let gifUrl;
    try {
        const response = await axios.get('https://api.waifu.pics/sfw/lick');
        gifUrl = response.data.url;
    } catch (error) {
        console.error('Error al obtener el GIF:', error);
        return m.reply('Ocurrió un error al obtener el GIF. Inténtalo de nuevo más tarde.');
    }

    // Enviar el mensaje con el GIF y menciones internas
    await conn.sendMessage(m.chat, {
        video: { url: gifUrl }, // WhatsApp maneja los gifs como video
        gifPlayback: true,
        caption: `✨ *${senderName}* lamió a *${mentionedName}* 🐾`,
        mentions: [senderJid, mentionedJid] // Mención interna sin @ visible
    }, { quoted: m });
};

handler.command = ['lick'];
export default handler;
                               
