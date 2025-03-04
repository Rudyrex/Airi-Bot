let handler = async (m, { conn }) => {
    // Verifica si el mensaje es una respuesta al mensaje del bot con "te desafía"
    if (m.quoted && conn.user.jid === m.quoted.sender && m.quoted.text.includes('te desafía')) {
        if (!/^aceptar$/i.test(m.text)) return; // Solo responde si el mensaje es "Aceptar"

        let match = m.quoted.text.match(/@(\d+)/); // Busca el número de la mención en el texto
        let challenger = match ? `${match[1]}@s.whatsapp.net` : null; // Formatea el número a JID

        if (!challenger) return m.reply("No se encontró al desafiante."); // Maneja el caso en que no haya mención

        let user = m.sender; // Usuario que acepta el desafío
        let tag1 = `@${challenger.replace(/@.+/, '')}`;
        let tag2 = `@${user.replace(/@.+/, '')}`;

        conn.reply(m.chat, `${tag2} ha aceptado el desafío de ${tag1}! 🎣`, m, {
            mentions: [challenger, user]
        });
    }
}

// Detecta solo la palabra "Aceptar" cuando se responde al mensaje del bot
handler.customPrefix = /^aceptar$/i;
handler.command = new RegExp;

export default handler;
