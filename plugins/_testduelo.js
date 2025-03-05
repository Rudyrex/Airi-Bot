let handler = async (m, { conn }) => {
    if (m.quoted && conn.user.jid === m.quoted.sender && m.quoted.text.includes('te desafía')) {
        if (!/^aceptar$/i.test(m.text)) return; // Solo responde si el mensaje es "aceptar"

        let match = m.quoted.text.match(/@(\d+)/);
        let challenger = match ? `${match[1]}@s.whatsapp.net` : null;

        if (!challenger) return m.reply("No se encontró al desafiante.");

        let user = m.sender;

        // Verificar que el usuario que acepta no sea el mismo que desafió
        if (user === challenger) {
            return m.reply("❌ No puedes aceptar tu propio desafío.");
        }

        let userData = global.db.data.users[user];
        let challengerData = global.db.data.users[challenger];

        // Verificar si el usuario que acepta tiene Magikarps
        if (!userData.peces || userData.peces.length === 0) {
            return m.reply("❌ No tienes ningún Magikarp para participar en el duelo.");
        }

        // Seleccionar Magikarps aleatorios de cada usuario
        let magikarp1 = challengerData.peces[Math.floor(Math.random() * challengerData.peces.length)];
        let magikarp2 = userData.peces[Math.floor(Math.random() * userData.peces.length)];

        // Calcular altura del salto en metros (1 KP = 1 cm)
        let salto1 = magikarp1.kp / 100;
        let salto2 = magikarp2.kp / 100;
        let diferencia = Math.abs(salto1 - salto2).toFixed(2);

        // Asignar identificadores numéricos para los jugadores
        let jugador1 = `@${challenger.replace(/@.+/, '')}`;
        let jugador2 = `@${user.replace(/@.+/, '')}`;

        let resultadoMensaje;
        let gananciaEmpate = Math.floor(Math.random() * 6) + 5; // 5-10 KP para ambos en caso de empate

        // Manejo del resultado del duelo
        if (magikarp1.kp > magikarp2.kp) {
            // Gana el desafiante
            let gananciaGanador = Math.floor(Math.random() * 16) + 15; // 15-30 KP
            let gananciaPerdedor = Math.floor(Math.random() * 11) + 5; // 5-15 KP

            // Sumar puntos
            challengerData.puntosDuelo = (challengerData.puntosDuelo || 0) + 1;
            magikarp1.kp += gananciaGanador;
            magikarp2.kp += gananciaPerdedor;

            resultadoMensaje = `🎏 *Comienza el duelo de ${jugador1} contra ${jugador2}!* 🎏

🐟 *Magikarp (${magikarp1.kp - gananciaGanador} KP)* de ${jugador1} ha saltado *${salto1.toFixed(2)}m* y recibe *${gananciaGanador} KP* y *1 punto de duelo*.

🐠 *Magikarp (${magikarp2.kp - gananciaPerdedor} KP)* de ${jugador2} ha saltado *${salto2.toFixed(2)}m* y recibe *${gananciaPerdedor} KP*.

🏆 *${jugador1} ha ganado por ${diferencia}m!* 🎊`;
        } else if (magikarp1.kp < magikarp2.kp) {
            // Gana el que aceptó el reto
            let gananciaGanador = Math.floor(Math.random() * 16) + 15; // 15-30 KP
            let gananciaPerdedor = Math.floor(Math.random() * 11) + 5; // 5-15 KP

            // Sumar puntos
            userData.puntosDuelo = (userData.puntosDuelo || 0) + 1;
            magikarp2.kp += gananciaGanador;
            magikarp1.kp += gananciaPerdedor;

            resultadoMensaje = `🎏 *Comienza el duelo de ${jugador1} contra ${jugador2}!* 🎏

🐟 *Magikarp (${magikarp1.kp - gananciaPerdedor} KP)* de ${jugador1} ha saltado *${salto1.toFixed(2)}m* y recibe *${gananciaPerdedor} KP*.

🐠 *Magikarp (${magikarp2.kp - gananciaGanador} KP)* de ${jugador2} ha saltado *${salto2.toFixed(2)}m* y recibe *${gananciaGanador} KP* y *1 punto de duelo*.

🏆 *${jugador2} ha ganado por ${diferencia}m!* 🎊`;
        } else {
            // Empate
            magikarp1.kp += gananciaEmpate;
            magikarp2.kp += gananciaEmpate;

            resultadoMensaje = `🎏 *Comienza el duelo de ${jugador1} contra ${jugador2}!* 🎏

🐟 *Magikarp (${magikarp1.kp - gananciaEmpate} KP)* de ${jugador1} ha saltado *${salto1.toFixed(2)}m* y recibe *${gananciaEmpate} KP*.

🐠 *Magikarp (${magikarp2.kp - gananciaEmpate} KP)* de ${jugador2} ha saltado *${salto2.toFixed(2)}m* y recibe *${gananciaEmpate} KP*.

🤝 *El duelo ha terminado en empate!* 🎏`;
        }

        // Mensaje de aceptación del duelo
        conn.reply(m.chat, `${jugador2} ha aceptado el desafío de ${jugador1}! 🎣`, m, {
            mentions: [challenger, user]
        });

        // Mostrar resultados del duelo con un pequeño retraso
        setTimeout(() => {
            conn.reply(m.chat, resultadoMensaje, m, {
                mentions: [challenger, user]
            });
        }, 3000); // Retraso de 3 segundos para dramatismo
    }
}

handler.customPrefix = /^aceptar$/i;
handler.command = new RegExp;

export default handler;
