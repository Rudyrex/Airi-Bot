let handler = async (m, { conn }) => {
    if (m.fromMe) return; // Evita que el bot se responda a sí mismo
    
    let user = global.db.data.users[m.sender];

    if (!user.peces || user.peces.length === 0) {
        return m.reply("No tienes Magikarps para iniciar un duelo.");
    }
    
    let user = m.sender; // Obtiene el ID del usuario que envió el mensaje
    let tag = `@${user.replace(/@.+/, '')}`; // Formatea el ID para etiquetar en el mensaje

    conn.reply(m.chat, `${tag} te desafía a un duelo de Magikarp Jump!`, m);
}

// Detecta varias expresiones sin prefijo
handler.customPrefix = /^(Magikarp jump!|Duelo|🐟)$/i;
handler.command = new RegExp;

export default handler;
