const tiempoEspera = 15 * 60 * 1000; // 15 minutos en milisegundos

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];

  // Inicializar propiedades si no existen
  if (!user.fishingCooldown) user.fishingCooldown = 0;
  if (!user.peces) user.peces = [];

  // Verificar cooldown
  if (Date.now() - user.fishingCooldown < tiempoEspera) {
    const tiempoRestante = segundosAHMS((user.fishingCooldown + tiempoEspera - Date.now()) / 1000);
    return m.reply(`🕜 Espera *${tiempoRestante}* para volver a pescar.`);
  }

  // Verificar si ya tiene el máximo de Magikarps
  if (user.peces.length >= 3) {
    return m.reply("❌ Ya tienes el máximo de 3 Magikarps. Suéltalos antes de pescar más.");
  }

  // Determinar si atrapa un Magikarp (50% de probabilidad)
  if (Math.random() < 0.5) {
    return m.reply("🎣 Pescaste... pero no atrapaste nada. ¡Intenta de nuevo más tarde!");
  }

  // Crear un nuevo Magikarp
  let nuevoMagikarp = {
    nombre: "Magikarp",
    nivel: 1, // Siempre inicia en nivel 1
    kp: Math.floor(Math.random() * 151) + 50 // KP entre 50 y 200
  };

  user.peces.push(nuevoMagikarp);
  user.fishingCooldown = Date.now();

  m.reply(`🎉 ¡Has atrapado un *Magikarp*!  
✨ Nivel: ${nuevoMagikarp.nivel}  
⚡ KP: ${nuevoMagikarp.kp}  
🎏 Ahora tienes ${user.peces.length}/3 Magikarps.`);
};

handler.help = ['pescar'];
handler.tags = ['rpg'];
handler.command = ['pescar'];
export default handler;

function segundosAHMS(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = Math.floor(segundos % 60);
  return `${minutos} minutos y ${segundosRestantes} segundos`;
           }
