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

    // Aplicar cooldown de 5 minutos
    let now = Date.now();
    let cooldown = 5 * 60 * 1000;
    if (user2.cooldownDuelo && now - user2.cooldownDuelo < cooldown) {
      let restante = Math.ceil((cooldown - (now - user2.cooldownDuelo)) / 1000);
      let minutos = Math.floor(restante / 60);
      let segundos = restante % 60;
      return m.reply(`🕜 Espera *${minutos} minutos y ${segundos} segundos* para volver a aceptar un duelo.`);
    }
    user2.cooldownDuelo = now;

    let tag1 = `@${challenger.replace(/@.+/, '')}`;
    let tag2 = `@${m.sender.replace(/@.+/, '')}`;

    // Mensaje de confirmación de desafío aceptado
    conn.reply(m.chat, `${tag2} ha aceptado el desafío de ${tag1}! 🎣`, m, { mentions: [challenger, m.sender] });

    // Editar el mensaje original sin tags
    try {
      await conn.sendMessage(
        m.chat,
        { text: `🎏 *Inició un nuevo desafío* 🎏`, edit: m.quoted.vM.key }
      );
    } catch (error) {
      console.error("No se pudo editar el mensaje:", error);
    }

    // Seleccionar aleatoriamente un Magikarp de cada usuario
    let magikarp1 = user1.peces[Math.floor(Math.random() * user1.peces.length)];
    let magikarp2 = user2.peces[Math.floor(Math.random() * user2.peces.length)];

    let kp1 = magikarp1.kp;
    let kp2 = magikarp2.kp;

    let ganador, perdedor, tagGanador, tagPerdedor;
    let saltoGanador, saltoPerdedor, diferenciaSalto;

    // Si alguno (o ambos) tiene 300 o más KP, se ignora la probabilidad aleatoria
    if (kp1 >= 300 || kp2 >= 300) {
      if (kp1 > kp2) {
        ganador = { usuario: challenger, magikarp: magikarp1 };
        perdedor = { usuario: m.sender, magikarp: magikarp2 };
        tagGanador = tag1;
        tagPerdedor = tag2;
      } else if (kp2 > kp1) {
        ganador = { usuario: m.sender, magikarp: magikarp2 };
        perdedor = { usuario: challenger, magikarp: magikarp1 };
        tagGanador = tag2;
        tagPerdedor = tag1;
      } else {
        if (Math.random() < 0.5) {
          ganador = { usuario: challenger, magikarp: magikarp1 };
          perdedor = { usuario: m.sender, magikarp: magikarp2 };
          tagGanador = tag1;
          tagPerdedor = tag2;
        } else {
          ganador = { usuario: m.sender, magikarp: magikarp2 };
          perdedor = { usuario: challenger, magikarp: magikarp1 };
          tagGanador = tag2;
          tagPerdedor = tag1;
        }
      }
      // Calcular saltos directamente según los KP
      saltoGanador = (ganador.magikarp.kp * 0.035).toFixed(2);
      saltoPerdedor = (perdedor.magikarp.kp * 0.035).toFixed(2);
      diferenciaSalto = (saltoGanador - saltoPerdedor).toFixed(2);
    } else {
      // Lógica original basada en probabilidad aleatoria
      let probabilidad1 = (kp1 / (kp1 + kp2)) * 100;
      let numeroAzar = Math.random() * 100;
      if (numeroAzar <= probabilidad1) {
        ganador = { usuario: challenger, magikarp: magikarp1 };
        perdedor = { usuario: m.sender, magikarp: magikarp2 };
        tagGanador = tag1;
        tagPerdedor = tag2;
      } else {
        ganador = { usuario: m.sender, magikarp: magikarp2 };
        perdedor = { usuario: challenger, magikarp: magikarp1 };
        tagGanador = tag2;
        tagPerdedor = tag1;
      }
      saltoPerdedor = (perdedor.magikarp.kp * 0.035).toFixed(2);
      diferenciaSalto = (Math.random() * (0.25 - 0.01) + 0.01).toFixed(2);
      saltoGanador = (parseFloat(saltoPerdedor) + parseFloat(diferenciaSalto)).toFixed(2);
    }

    // Guardar los KP originales antes de sumar las recompensas
    let originalKpGanador = ganador.magikarp.kp;
    let originalKpPerdedor = perdedor.magikarp.kp;

    let recompensaGanador = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
    let recompensaPerdedor = Math.floor(Math.random() * (15 - 5 + 1)) + 5;

    // Aplicar las recompensas (se suman a los KP del magikarp)
    ganador.magikarp.kp += recompensaGanador;
    perdedor.magikarp.kp += recompensaPerdedor;

    if (!global.db.data.users[ganador.usuario].puntosDuelo) {
      global.db.data.users[ganador.usuario].puntosDuelo = 0;
    }
    global.db.data.users[ganador.usuario].puntosDuelo += 1;

    // Si aparece Pidgeotto, se usa el valor original para mostrar la altura y KP
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
      // El otro jugador es quien no tuvo su Magikarp llevado
      let otroJugador = pidgeottoSeLleva === ganador ? perdedor : ganador;
      // Usamos los KP originales en el mensaje
      let kpPidgeottoOriginal = pidgeottoSeLleva === ganador ? originalKpGanador : originalKpPerdedor;
      let kpOtroOriginal = pidgeottoSeLleva === ganador ? originalKpPerdedor : originalKpGanador;

      let mensajePidgeotto = `
😱 *Oh no, un Pidgeotto salvaje apareció y se llevó el Magikarp de ${tagPidgeotto}!*

🐟 *Magikarp (${kpPidgeottoOriginal} KP)* de ${tagPidgeotto} saltó *${pidgeottoSeLleva === ganador ? saltoGanador : saltoPerdedor}m* y fue atrapado.

🐠 *Magikarp (${kpOtroOriginal} KP)* de ${otroJugador.usuario === challenger ? tag1 : tag2} ha saltado *${pidgeottoSeLleva === ganador ? saltoPerdedor : saltoGanador}m* y recibe *${recompensaGanador} KP* y *1 punto de duelo*.

🏆 ${otroJugador.usuario === challenger ? tag1 : tag2} ha ganado automáticamente! 🎊
`;
      // Eliminar al Magikarp atrapado
      global.db.data.users[pidgeottoSeLleva.usuario].peces = global.db.data.users[pidgeottoSeLleva.usuario].peces.filter(p => p !== pidgeottoSeLleva.magikarp);
      return conn.reply(m.chat, mensajePidgeotto, m, { mentions: [challenger, m.sender] });
    }

    // Mensaje normal del duelo (usando los KP originales)
    let mensaje = `
🎏 *Comienza el duelo de ${tagGanador} contra ${tagPerdedor}!* 🎏

🐟 *Magikarp (${originalKpPerdedor} KP)* de ${tagPerdedor} saltó *${saltoPerdedor}m* y recibe *${recompensaPerdedor} KP*.

🐠 *Magikarp (${originalKpGanador} KP)* de ${tagGanador} saltó *${saltoGanador}m* y recibe *${recompensaGanador} KP* y *1 punto de duelo*.

🏆 ${tagGanador} ha ganado por *${diferenciaSalto}m*! 🎊
`;

    conn.reply(m.chat, mensaje, m, { mentions: [challenger, m.sender] });
  }
};

handler.customPrefix = /^aceptar$/i;
handler.command = new RegExp;

export default handler;
    
