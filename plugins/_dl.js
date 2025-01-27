const handler = async (m, { conn, text }) => {
  if (!m.quoted) return m.reply('Etiqueta el mensaje que contenga el resultado de YouTube Play.');
  
  if (!m.quoted.text.includes('Responde con dl + num del resultado para descargar')) {
    return m.reply('Etiqueta el mensaje que contenga el resultado de YouTube Play.');
  }
  if (!m.quoted.fromMe) {
    return m.reply('Etiqueta un mensaje mío que contenga el resultado de YouTube Play.');
  }
  let urls = m.quoted.text.match(
    new RegExp(
      /(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed|shorts)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]+)/,
      'gi'
    )
  );
  if (!urls) return m.reply('No se encontraron enlaces en el mensaje citado.');
  let numero = parseInt(text.trim().split(' ')[1], 10); 
  if (isNaN(numero) || numero < 1 || numero > urls.length) {
    return m.reply('Por favor, proporciona un número válido dentro del rango de resultados.');
  }
  let url = urls[numero - 1];
  await m.react('🕓'); 
  try {
    await conn.sendMessage(m.chat, { text: url }, { quoted: m });
    await m.react('✅'); 
  } catch (error) {
    console.error(error);
    m.reply('Hubo un error al intentar descargar el archivo.');
  }
};

handler.help = ['dl <número>'];
handler.tags = ['dl'];
handler.customPrefix = /^(dl)/
handler.command = new RegExp;

export default handler;