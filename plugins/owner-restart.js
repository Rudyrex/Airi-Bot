
import { spawn } from 'child_process';

let handler = async (m, { conn, isROwner }) => {
  if (!process.send) throw 'Usa `node index.js` para ejecutar este comando.';
  if (!isROwner) throw 'Este comando solo puede ser usado por el propietario.';

  const progress = ['10%', '30%', '50%', '80%', '100%'];
  const { key } = await conn.sendMessage(
    m.chat,
    { text: '*Reiniciando el bot...*' },
    { quoted: m }
  );

  
  for (const step of progress) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula progreso
    await conn.sendMessage(m.chat, { text: step, edit: key }, { quoted: m });
  }
  await conn.reply(m.chat, key, m);
  await conn.sendMessage(
    m.chat,
    { text: '🚀 Reiniciando el bot. Espere un momento.', edit: key },
    { quoted: m }
  );

  process.send('reset'); // Enviar señal de reinicio
};

handler.help = ['restart'];
handler.tags = ['owner'];
handler.command = ['restart', 'reiniciar'];
handler.rowner = true;

export default handler;




/*
let handler = async (m) => {
  await m.reply('⚙️ Reiniciando el bot...');
  process.exit(0);  // Finaliza el proceso actual
};

handler.help = ['reiniciar'];
handler.tags = ['owner'];
handler.command = ['restart', 'reiniciar'];
handler.rowner = true;

export default handler;
*/
