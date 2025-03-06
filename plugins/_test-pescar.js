import fetch from 'node-fetch';

function segundosAHMS(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = Math.floor(segundos % 60);
  return `${minutos} minutos y ${segundosRestantes} segundos`;
}


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
    return m.reply(`${em} Espera *${tiempoRestante}* para volver a pescar`);
  }

  // Activar el cooldown antes de evaluar si atrapa algo
  user.fishingCooldown = Date.now();

  // Verificar si ya tiene el máximo de Magikarps
  if (user.peces.length >= 3) {
    return m.reply(`${em} Ya tienes el máximo de 3 Magikarps`);
  }

  // Determinar si atrapa un Magikarp (50% de probabilidad)
  if (Math.random() < 0.5) {
    return await conn.sendAiri(m.chat, botname, botdesc, '🎣 Pescaste... pero se te escapó.\n¡Mas suerte para la próxima!', true, thumb, null, null);
  }

  // Crear un nuevo Magikarp
  let nuevoMagikarp = {
    nombre: "Magikarp",
    kp: Math.floor(Math.random() * 151) + 50 // KP entre 50 y 200
  };

  user.peces.push(nuevoMagikarp);
  
  await conn.sendAiri(m.chat, botname, botdesc, `🎣 ¡Has atrapado un *Magikarp*!.
⚡ KP: ${nuevoMagikarp.kp}  
🎏 Ahora tienes ${user.peces.length}/3 Magikarps.`, true, thumb, null, null);


handler.help = ['pescar'];
handler.tags = ['rpg'];
handler.command = ['pescar'];
export default handler;
