let handler = async (m, { conn }) => {
  if (global.conn.user.jid === conn.user.jid) {
   await conn.reply(m.chat, '✳️ ¿Por qué no vas directamente a la terminal?', m);
  } else {
    await conn.reply(m.chat, `✅ Se pauso la conexión con el subbot exitosamente!`, m);
    conn.ws.close();
  }
};

handler.command = ['stop', 'stopbot', 'pause']

export default handler
