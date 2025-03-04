let handler = async (m, { conn }) => {
    // Verifica si el mensaje es una respuesta a otro mensaje (quoted)
    if (m.quoted && conn.user.jid === m.quoted.sender && m.quoted.text.includes('te desafía')) {
        if (!/^aceptar$/i.test(m.text)) return; // Solo responde si el mensaje es "Aceptar"

        let challenger = m.quoted.mentions[0]; // Obtiene al usuario que envió el desafío
        if (!challenger) return m.reply("No se encontró al desafiante.");

        let user = m.sender; // Usuario que acepta el desafío
        let tag1 = `@${challenger.replace(/@.+/, '')}`;
        let tag2 = `@${user.replace(/@.+/, '')}`;

        conn.reply(m.chat, `${tag2} ha aceptado el duelo de ${tag1}`, m, {
            mentions: [challenger, user]
        });
    }
}

// Detecta solo la palabra "Aceptar" cuando se responde al mensaje del bot
handler.customPrefix = /^aceptar$/i;
handler.command = new RegExp;

export default handler;
      
