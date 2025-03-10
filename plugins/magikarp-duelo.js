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
    let thumbDesafio = await (await fetch('https://files.catbox.moe/8y8wnc.jpg')).buffer();
    await conn.sendAiri(m.chat, botname, botdesc, `${tag2} ha aceptado el desafío de ${tag1}! 🎣`, true, thumbDesafio, null, m);

    // Editar el mensaje original sin tags
    try {
      await conn.sendMessage(
        m.chat,
        { text: `🎏 *Inició un nuevo desafío* 🎏`, edit: m.quoted.vM.key }
      );
    } catch (error) {
      console.error("No se pudo editar el mensaje:", error);
    }

    // Rama de Snorlax: 10% de probabilidad de que aparezca un Snorlax y se cancele el duelo
    if (Math.random() < 0.1) {
        let thumbSnorlax = await (await fetch('https://files.catbox.moe/vdtkss.jpg')).buffer();
        await conn.sendAiri(m.chat, botname, botdesc, `*Un Snorlax duerme en el campo de desafío!*\nVuelvan más tarde cuando se haya despertado`, true, thumbSnorlax, null, m);
        return;
    }

    // Seleccionar aleatoriamente un Magikarp de cada usuario
    let magikarp1 = user1.peces[Math.floor(Math.random() * user1.peces.length)];
    let magikarp2 = user2.peces[Math.floor(Math.random() * user2.peces.length)];

    let kp1 = magikarp1.kp;
    let kp2 = magikarp2.kp;

    let winner, loser, tagWinner, tagLoser;
    let jumpWinner, jumpLoser, diffJump;

    // Nueva lógica de probabilidad fija:
    // - El magikarp con menos KP gana solo en el 10% de las ocasiones;
    // - Si son iguales se decide al azar.
    if (kp1 === kp2) {
      if (Math.random() < 0.5) {
        winner = { usuario: challenger, magikarp: magikarp1, kp: kp1 };
        loser  = { usuario: m.sender,   magikarp: magikarp2, kp: kp2 };
        tagWinner = tag1; tagLoser = tag2;
      } else {
        winner = { usuario: m.sender,   magikarp: magikarp2, kp: kp2 };
        loser  = { usuario: challenger, magikarp: magikarp1, kp: kp1 };
        tagWinner = tag2; tagLoser = tag1;
      }
    } else {
      let more, less;
      if (kp1 > kp2) {
        more = { usuario: challenger, magikarp: magikarp1, kp: kp1, tag: tag1 };
        less = { usuario: m.sender,     magikarp: magikarp2, kp: kp2, tag: tag2 };
      } else {
        more = { usuario: m.sender,     magikarp: magikarp2, kp: kp2, tag: tag2 };
        less = { usuario: challenger, magikarp: magikarp1, kp: kp1, tag: tag1 };
      }
      // El que tiene más KP gana en el 90% de las veces
      if (Math.random() < 0.9) {
        winner = more;
        loser  = less;
      } else {
        winner = less;
        loser  = more;
      }
      tagWinner = winner.tag;
      tagLoser  = loser.tag;
    }

    // Guardar los KP originales antes de aplicar recompensas
    let originalKpWinner = winner.kp;
    let originalKpLoser = loser.kp;

    // Calcular saltos: 1 KP = 3.5 cm (0.035 m)
    // Si el ganador (upset) era el que tenía menos KP, su salto será el salto normal del magikarp con más KP
    // + un extra aleatorio entre 0.05 y 0.50 m.
    let normalJumpMore = (Math.max(kp1, kp2) * 0.035);
    let normalJumpLoser = (loser.kp * 0.035);
    if (winner.kp < loser.kp) {
      let extra = Math.random() * (0.50 - 0.05) + 0.05;
      jumpWinner = (normalJumpMore + extra).toFixed(2);
      jumpLoser = normalJumpLoser.toFixed(2);
    } else {
      jumpWinner = (winner.kp * 0.035).toFixed(2);
      jumpLoser  = (loser.kp * 0.035).toFixed(2);
    }
    diffJump = (jumpWinner - jumpLoser).toFixed(2);

    // Recompensas
    let recompensaWinner = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
    let recompensaLoser = Math.floor(Math.random() * (15 - 5 + 1)) + 5;

    // Aplicar recompensas
    winner.magikarp.kp += recompensaWinner;
    loser.magikarp.kp += recompensaLoser;
    if (!global.db.data.users[winner.usuario].puntosDuelo) {
      global.db.data.users[winner.usuario].puntosDuelo = 0;
    }
    global.db.data.users[winner.usuario].puntosDuelo += 1;

    // Lógica de Pidgeotto (igual que antes)
    let pidgeottoSeLleva = null;
    if (jumpWinner > 10 && jumpLoser > 10) {
      pidgeottoSeLleva = Math.random() < 0.5 ? winner : loser;
    } else if (jumpWinner > 10 && Math.random() < 0.9) {
      pidgeottoSeLleva = winner;
    } else if (jumpLoser > 10 && Math.random() < 0.9) {
      pidgeottoSeLleva = loser;
    }

    if (pidgeottoSeLleva) {
      let tagPidgeotto = `@${pidgeottoSeLleva.usuario.replace(/@.+/, '')}`;
      let otroJugador = (pidgeottoSeLleva.usuario === winner.usuario) ? loser : winner;
      let kpPidgeottoOriginal = (pidgeottoSeLleva === winner) ? originalKpWinner : originalKpLoser;
      let kpOtroOriginal = (pidgeottoSeLleva === winner) ? originalKpLoser : originalKpWinner;
      
      let thumbPidgeotto = await (await fetch('https://files.catbox.moe/00654k.jpg')).buffer();
      let mensajePidgeotto = `
😱 *Oh no, un Pidgeotto salvaje apareció y se llevó el Magikarp de ${tagPidgeotto}!*

🐟 *Magikarp (${kpPidgeottoOriginal} KP)* de ${tagPidgeotto} saltó *${pidgeottoSeLleva === winner ? jumpWinner : jumpLoser}m* y fue atrapado.

🐠 *Magikarp (${kpOtroOriginal} KP)* de ${(otroJugador.usuario === challenger) ? tag1 : tag2} saltó *${pidgeottoSeLleva === winner ? jumpLoser : jumpWinner}m* y recibe *${recompensaWinner} KP* y *1 punto de duelo*.

✨ ${(otroJugador.usuario === challenger) ? tag1 : tag2} ha ganado automáticamente! 🎊
`;
      global.db.data.users[pidgeottoSeLleva.usuario].peces = global.db.data.users[pidgeottoSeLleva.usuario].peces.filter(p => p !== pidgeottoSeLleva.magikarp);
      return await conn.sendAiri(m.chat, botname, botdesc, mensajePidgeotto, true, thumbPidgeotto, null, m);
    }

    // Mensaje normal del duelo (usando los KP originales)
    let thumbJump = await (await fetch('https://files.catbox.moe/36jon9.jpg')).buffer();
    let mensaje = `
🎏 *Comienza el duelo de ${tagWinner} contra ${tagLoser}!* 🎏

🐟 *Magikarp (${originalKpLoser} KP)* de ${tagLoser} saltó *${jumpLoser}m* y recibe *${recompensaLoser} KP*.

🐠 *Magikarp (${originalKpWinner} KP)* de ${tagWinner} saltó *${jumpWinner}m* y recibe *${recompensaWinner} KP* y *1 punto de duelo*.

✨ ${tagWinner} ha ganado por *${diffJump}m*! 🎊
`;

    await conn.sendAiri(m.chat, botname, botdesc, mensaje, true, thumbJump, null, m);
  }
};

handler.customPrefix = /^aceptar$/i;
handler.command = new RegExp;

export default handler;
    
