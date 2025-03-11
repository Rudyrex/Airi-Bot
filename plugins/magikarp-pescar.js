import { sticker } from '../lib/sticker.js'

const tiempoEspera = 15 * 60 * 1000; // 15 minutos en milisegundos

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let thumb = await (await fetch('https://files.catbox.moe/7v2vb7.jpg')).buffer();
  
  
  // Inicializar propiedades si no existen
  if (!user.fishingCooldown) user.fishingCooldown = 0;
  if (!user.peces) user.peces = [];

  // Verificar cooldown
  if (Date.now() - user.fishingCooldown < tiempoEspera) {
    const tiempoRestante = segundosAHMS((user.fishingCooldown + tiempoEspera - Date.now()) / 1000);
    return m.reply(`🕜 Espera *${tiempoRestante}* para volver a pescar.`);
  }

  // Activar el cooldown antes de evaluar si atrapa algo
  user.fishingCooldown = Date.now();

  // Verificar si ya tiene el máximo de Magikarps
  if (user.peces.length >= 3) {
    return m.reply("❌ Ya tienes el máximo de 3 Magikarps.");
  }

  // Determinar si atrapa un Magikarp (50% de probabilidad)
  if (Math.random() < 0.5) {
    let stickerPescar = await sticker(false, 'https://files.catbox.moe/kxjs7i.webp', packname, author);
    await conn.sendFile(m.chat, stickerPescar, 'sticker.webp', '', m)
    return await conn.reply(m.chat, `🎣 Pescaste... pero se te escapó.\n¡Mas suerte para la próxima!`, m);
  }

  // Crear un nuevo Magikarp
  let nuevoMagikarp = {
    nombre: "Magikarp",
    kp: Math.floor(Math.random() * 151) + 50 // KP entre 50 y 200
  };

  user.peces.push(nuevoMagikarp);
  let stickerMagikarp = await sticker(false, 'https://files.catbox.moe/kxjs7i.webp', packname, author);
  await conn.sendFile(m.chat, stickerMagikarp, 'sticker.webp', '', m)
  await conn.reply(m.chat, `🎣 ¡Has atrapado un *Magikarp*!
⚡ KP: ${nuevoMagikarp.kp}  
🎏 Ahora tienes ${user.peces.length}/3 Magikarps`, m);
}

handler.command = ['pescar'];
export default handler;

function segundosAHMS(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = Math.floor(segundos % 60);
  return `${minutos} minutos y ${segundosRestantes} segundos`;
}
  
