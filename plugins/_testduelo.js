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

        // Aplicar cooldown de 10 minutos
        let now = Date.now();
        let cooldown = 5 * 60 * 1000;
        if (user2.cooldownDuelo && now - user2.cooldownDuelo < cooldown) {
            let restante = Math.ceil((cooldown - (now - user2.cooldownDuelo)) / 1000);
            let minutos = Math.floor(restante / 60);
            let segundos = restante % 60;
            return m.reply(`🕜 Espera *${minutos} minutos y ${segundos} segundos* para volver a aceptar un duelo.`);
        }
        user2.cooldownDuelo = now;

        // Editar el mensaje original para que ya no se pueda aceptar
        try {
            await conn.sendMessage(
                m.chat,
                { 
                    text: `🎏 *Inició un desafío entre @${challenger.replace(/@.+/, '')} y @${m.sender.replace(/@.+/, '')}!* 🎏`, 
                    edit: m.quoted.vM.key
                },
                { mentions: [challenger, m.sender] }
            );
        } catch (error) {
            console.error("No se pudo editar el mensaje:", error);
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
            
