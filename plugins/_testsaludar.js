let handler = async (m, { conn, participants }) => {
    const users = participants.map(u => u.id); // Menciona a todos los participantes del grupo
    const mentionsText = users.map(u => `@${u.split('@')[0]}`).join(' ');

    await conn.sendMessage(m.chat, {
        text: `Saludos para: ${mentionsText}`,
        mentions: users
    });
};

handler.command = ['saludar'];
export default handler;
