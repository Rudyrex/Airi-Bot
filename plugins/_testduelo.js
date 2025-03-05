let handler = async (m, { conn }) => {
    if (m.quoted && conn.user.jid === m.quoted.sender && m.quoted.text.includes('te desafía')) {
        if (!/^aceptar$/i.test(m.text)) return;

        let match = m.quoted.text.match(/@(\d+)/);
        let challenger = match ? `${match[1]}@s.whatsapp.net` : null;

        if (!challenger) return m.reply("No se encontró al desafiante.");
        if (m.sender === challenger) return m.reply("No puedes aceptar tu propio desafío.");

        let user1 = global.db.data.users[challenger];
        let user2 = global.db.data.users[m.sender];

        if (!user2.peces || user2.peces.length === 0) {
            return m.reply("No tienes Magikarps para competir en el duelo.");
        }

        let magikarp1 = user1.peces[Math.floor(Math.random() * user1.peces.length)];
        let magikarp2 = user2.peces[Math.floor(Math.random() * user2.peces.length)];

        let kp1 = magikarp1.kp;
        let kp2 = magikarp2.kp;

        let probabilidad1 = (kp1 / (kp1 + kp2)) * 100;
        let numeroAzar = Math.random() * 100;

        let ganador, perdedor;

        if (numeroAzar <= probabilidad1) {
            ganador = { usuario: challenger, magikarp: magikarp1 };
            perdedor = { usuario: m.sender, magikarp: magikarp2 };
        } else {
            ganador = { usuario: m.sender, magikarp: magikarp2 };
            perdedor = { usuario: challenger, magikarp: magikarp1 };
        }

        // Cálculo de saltos (1 KP = 3.5 cm = 0.035 m)
        let saltoPerdedor = (perdedor.magikarp.kp * 0.035).toFixed(2);
        let diferenciaSalto = (Math.random() * (0.25 - 0.01) + 0.01).toFixed(2);
        let saltoGanador = (parseFloat(saltoPerdedor) + parseFloat(diferenciaSalto)).toFixed(2);

        let recompensaGanador = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
        let recompensaPerdedor = Math.floor(Math.random() * (15 - 5 + 1)) + 5;

        ganador.magikarp.kp += recompensaGanador;
        perdedor.magikarp.kp += recompensaPerdedor;

        if (!global.db.data.users[ganador.usuario].puntosDuelo) {
            global.db.data.users[ganador.usuario].puntosDuelo = 0;
        }
        global.db.data.users[ganador.usuario].puntosDuelo += 1;

        let tag1 = `@${challenger.replace(/@.+/, '')}`;
        let tag2 = `@${m.sender.replace(/@.+/, '')}`;
        let tagGanador = `@${ganador.usuario.replace(/@.+/, '')}`;
        let tagPerdedor = `@${perdedor.usuario.replace(/@.+/, '')}`;

        // Verificar si algún Magikarp salta más de 10m
        let pidgeottoSeLleva = null;
        if (saltoGanador > 10 && saltoPerdedor > 10) {
            pidgeottoSeLleva = Math.random() < 0.5 ? ganador : perdedor;
        } else if (saltoGanador > 10 && Math.random() < 0.9) {
            pidgeottoSeLleva = ganador;
        } else if (saltoPerdedor > 10 && Math.random() < 0.9) {
            pidgeottoSeLleva = perdedor;
        }

        if (pidgeottoSeLleva) {
            let tagPidgeotto = `@${pidgeottoSeLleva.usuario.replace(/@.+/, '')}`;
            let otroJugador = pidgeottoSeLleva.usuario === ganador.usuario ? perdedor : ganador;
            let mensajePidgeotto = `
😱 *Oh no, un Pidgeotto salvaje apareció y se llevó el Magikarp de ${tagPidgeotto}!*

🐟 *Magikarp (${pidgeottoSeLleva.magikarp.kp} KP)* de ${tagPidgeotto} ha saltado *${pidgeottoSeLleva === ganador ? saltoGanador : saltoPerdedor}m*.

🐠 *Magikarp (${otroJugador.magikarp.kp} KP)* de ${otroJugador.usuario === challenger ? tag1 : tag2} ha saltado *${pidgeottoSeLleva === ganador ? saltoPerdedor : saltoGanador}m* y recibe *${recompensaGanador} KP* y *1 punto de duelo*.

🏆 ${otroJugador.usuario === challenger ? tag1 : tag2} ha ganado automáticamente! 🎊
`;
            global.db.data.users[pidgeottoSeLleva.usuario].peces = global.db.data.users[pidgeottoSeLleva.usuario].peces.filter(p => p !== pidgeottoSeLleva.magikarp);

            return conn.reply(m.chat, mensajePidgeotto, m, { mentions: [challenger, m.sender] });
        }

        // Mensaje normal si no aparece Pidgeotto
        let mensaje = `
🎏 *Comienza el duelo de ${tag1} contra ${tag2}!* 🎏

🐟 *Magikarp (${perdedor.magikarp.kp} KP)* de ${tagPerdedor} ha saltado *${saltoPerdedor}m* y recibe *${recompensaPerdedor} KP*.

🐠 *Magikarp (${ganador.magikarp.kp} KP)* de ${tagGanador} ha saltado *${saltoGanador}m* y recibe *${recompensaGanador} KP* y *1 punto de duelo*.

🏆 ${tagGanador} ha ganado por *${diferenciaSalto}m*! 🎊
`;

        conn.reply(m.chat, mensaje, m, { mentions: [challenger, m.sender] });
    }
};

// Detecta solo la palabra "aceptar" cuando se responde al mensaje del bot
handler.customPrefix = /^aceptar$/i;
handler.command = new RegExp;

export default handler;
