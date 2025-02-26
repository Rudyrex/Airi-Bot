import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
  try {
    let authFolderB = m.sender.split('@')[0]; // Carpeta de la sesión del usuario
    let sessionPath = `./Sesion Subbots/${authFolderB}`;

    // Verifica si la sesión existe
    if (!fs.existsSync(sessionPath)) {
      return m.reply(`⚠️ No se encontró ninguna sesión activa para ${authFolderB}.`);
    }

    // Cierra la conexión si existe
    const index = global.conns.findIndex(c => c.user?.jid === m.sender);
    if (index !== -1) {
      let userConn = global.conns[index];
      await userConn.ws.close(); // Cierra la conexión WebSocket
      global.conns.splice(index, 1); // Elimina de la lista de conexiones activas
    }

    // Elimina la carpeta de la sesión
    fs.rmSync(sessionPath, { recursive: true, force: true });

    m.reply(`✅ ¡Sesión eliminada correctamente para ${authFolderB}!\nSi deseas volver a vincular, utiliza el comando correspondiente.`);
  } catch (error) {
    console.error(`❌ Error al eliminar la sesión:`, error);
    m.reply(`❌ Ocurrió un error al intentar eliminar la sesión.`);
  }
};

handler.command = ['delsesion'];
handler.rowner = false;

export default handler;
                  
