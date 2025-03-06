let handler = async (m, { conn }) => {
    if (m.fromMe) return; // Evita que el bot se responda a sí mismo

    let user = global.db.data.users[m.sender];

    if (!user.peces || user.peces.length === 0) {
        return m.reply("No tienes Magikarps para iniciar un duelo.");
    }

    let ahora = Date.now();
    let cooldown = 10 * 60 * 1000; // 10 minutos en milisegundos

    if (user.cooldownDuelo && ahora - user.cooldownDuelo < cooldown) {
        let tiempoRestante = ((cooldown - (ahora - user.cooldownDuelo)) / 1000).toFixed(0);
        return m.reply(`Debes esperar ${tiempoRestante} segundos antes de desafiar nuevamente.`);
    }

    user.cooldownDuelo = ahora; // Guarda el tiempo actual como inicio del cooldown

    let tag = `@${m.sender.replace(/@.+/, '')}`; // Formatea el ID para etiquetar en el mensaje

    conn.reply(m.chat, `${tag} te desafía a un duelo de Magikarp Jump!`, m, { mentions: [m.sender] });
};

// Detecta varias expresiones sin prefijo
handler.customPrefix = /^(Magikarp jump!|Duelo|🐟)$/i;
handler.command = new RegExp;

export default handler;
    
