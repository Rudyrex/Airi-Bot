let handler = async (m, { conn }) => {
    if (m.fromMe) return; // Evita que el bot se responda a sí mismo

    let user = global.db.data.users[m.sender];

    if (!user.peces || user.peces.length === 0) {
        return m.reply("No tienes Magikarps para entrenar o desafiar.");
    }

    let ahora = Date.now();
    let cooldown = 5 * 60 * 1000; // 5 minutos en milisegundos

    if (user.cooldownDuelo && ahora - user.cooldownDuelo < cooldown) {
        let tiempoRestante = cooldown - (ahora - user.cooldownDuelo);
        let minutos = Math.floor(tiempoRestante / 60000);
        let segundos = Math.floor((tiempoRestante % 60000) / 1000);
        return m.reply(`🕜 Espera *${minutos} minutos y ${segundos} segundos* para volver a usar el comando.`);
    }
    user.cooldownDuelo = ahora; // Aplica el cooldown

    // Con 30% de probabilidad, el usuario entrena a su Magikarp
    if (Math.random() < 0.3) {
        // Entrenamiento: se elige un Magikarp aleatorio
        let magikarp = user.peces[Math.floor(Math.random() * user.peces.length)];
        // Guardamos los KP originales antes de entrenar
        let originalKP = magikarp.kp;
        // Se genera una recompensa aleatoria de KP entre 10 y 50
        let recompensa = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        // Se suma la recompensa al KP del Magikarp
        magikarp.kp += recompensa;

        let tag = `@${m.sender.replace(/@.+/, '')}`;
        conn.reply(m.chat, `El Magikarp (${originalKP} KP) de ${tag} decidió entrenar y ganó *${recompensa} KP*!`, m, { mentions: [m.sender] });
    } else {
        // Si no entrena, se envía el mensaje de desafío
        let tag = `@${m.sender.replace(/@.+/, '')}`;
        conn.reply(m.chat, `${tag} te desafía a un duelo de Magikarp Jump!`, m, { mentions: [m.sender] });
    }
};

// Detecta varias expresiones sin prefijo
handler.customPrefix = /^(Magikarp jump!|Duelo|🐟)$/i;
handler.command = new RegExp;

export default handler;
    
