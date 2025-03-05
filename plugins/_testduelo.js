let handler = async (m, { conn }) => {
    // Verifica si el mensaje es una respuesta al mensaje del bot con "te desafía"
    if (m.quoted && conn.user.jid === m.quoted.sender && m.quoted.text.includes('te desafía')) {
        if (!/^aceptar$/i.test(m.text)) return; // Solo responde si el mensaje es "aceptar"

        let match = m.quoted.text.match(/@(\d+)/); // Extrae el número de la mención en el mensaje
        let challenger = match ? `${match[1]}@s.whatsapp.net` : null; // Formatea el número a JID

        if (!challenger) return m.reply("No se encontró al desafiante."); 
        if (m.sender === challenger) return m.reply("No puedes aceptar tu propio desafío."); 

        let user1 = global.db.data.users[challenger]; // Datos del desafiante
        let user2 = global.db.data.users[m.sender]; // Datos del que acepta

        if (!user2.peces || user2.peces.length === 0) {
            return m.reply("No tienes Magikarps para competir en el duelo.");
        }

        // Seleccionar un Magikarp aleatorio de cada usuario
        let magikarp1 = user1.peces[Math.floor(Math.random() * user1.peces.length)];
        let magikarp2 = user2.peces[Math.floor(Math.random() * user2.peces.length)];

        let kp1 = magikarp1.kp;
        let kp2 = magikarp2.kp;

        // Calcular probabilidades de victoria
        let probabilidad1 = (kp1 / (kp1 + kp2)) * 100;
        let probabilidad2 = 100 - probabilidad1;

        // Generar número aleatorio para decidir el ganador
        let numeroAzar = Math.random() * 100;
        let ganador, perdedor, saltoGanador, saltoPerdedor;

        if (numeroAzar <= probabilidad1) {
            ganador = { usuario: challenger, magikarp: magikarp1 };
            perdedor = { usuario: m.sender, magikarp: magikarp2 };
        } else {
            ganador = { usuario: m.sender, magikarp: magikarp2 };
            perdedor = { usuario: challenger, magikarp: magikarp1 };
        }

        // Cálculo de saltos
        saltoPerdedor = perdedor.magikarp.kp / 100; // Altura normal del perdedor
        let diferenciaSalto = (Math.random() * (0.25 - 0.01) + 0.01).toFixed(2); // Diferencia entre 0.01m y 0.25m
        saltoGanador = (saltoPerdedor + parseFloat(diferenciaSalto)).toFixed(2); // Asegurar que el ganador siempre salta más

        // Asignación de recompensas
        let recompensaGanador = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
        let recompensaPerdedor = Math.floor(Math.random() * (15 - 5 + 1)) + 5;

        ganador.magikarp.kp += recompensaGanador;
        perdedor.magikarp.kp += recompensaPerdedor;

        // Sumar puntos de duelo solo al ganador
        if (!global.db.data.users[ganador.usuario].puntosDuelo) {
            global.db.data.users[ganador.usuario].puntosDuelo = 0;
        }
        global.db.data.users[ganador.usuario].puntosDuelo += 1;

        let tag1 = `@${challenger.replace(/@.+/, '')}`;
        let tag2 = `@${m.sender.replace(/@.+/, '')}`;
        let tagGanador = `@${ganador.usuario.replace(/@.+/, '')}`;
        let tagPerdedor = `@${perdedor.usuario.replace(/@.+/, '')}`;

        // Mensaje del resultado
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
                                               
