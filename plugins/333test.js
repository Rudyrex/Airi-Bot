import { apis } from '../exports.js';
import axios from 'axios';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("_*[ ⚠️ ] Ingresa lo que quieres buscar en Spotify*_");
  }

  try {
    // Obtener los resultados de la API
    const { data } = await axios.get(`${apis.delirius}search/spotify?q=${encodeURIComponent(text)}&limit=15`);

    if (!data.data) {
      return m.reply("⚠️ No se encontraron resultados para la búsqueda.");
    }

    // Crear un mensaje con los resultados numerados
    let response = `🎵 *Resultados para:* ${text}\n\n`;
    let links = [];
    data.data.forEach((result, index) => {
      response += `${index + 1}. *${result.title}* - ${result.artist}\n`;
      response += `   ⏱️ ${result.duration} | 🌐 Publicado: ${result.publish}\n`;
      links.push(result.url);
    });

    response += "\n_Responde con el número del resultado para seleccionarlo._";

    // Enviar el mensaje con los resultados y guardar el contexto
    m.reply(response);
    conn.spotifySearch = conn.spotifySearch || {};
    conn.spotifySearch[m.chat] = { links, quoted: m };

  } catch (error) {
    console.error(error);
    m.reply("_*[ ❌ ] Hubo un error al buscar. Inténtalo de nuevo más tarde.*_");
  }
};

// Manejador previo para procesar respuestas
handler.before = async function (m) {
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/🎵 \*Resultados para:/.test(m.quoted.text)) {
    return true;
  }

  const id = m.chat;
  const searchContext = this.spotifySearch?.[id];

  if (!searchContext) {
    return m.reply("⚠️ La búsqueda ya ha terminado o no se encontraron resultados.");
  }

  const { links, quoted } = searchContext;

  if (m.quoted.id !== quoted.id) {
    return true; // No es el mensaje esperado
  }

  // Validar si el mensaje es un número válido
  if (!/^\d+$/.test(m.text)) {
    return m.reply("⚠️ Por favor, responde con un número válido.");
  }

  const index = parseInt(m.text, 10) - 1;
  if (index < 0 || index >= links.length) {
    return m.reply("⚠️ El número ingresado no corresponde a ningún resultado.");
  }

  // Enviar el enlace correspondiente
  await m.reply(`✅ Aquí tienes el enlace:\n${links[index]}`);

  // Limpiar el contexto de búsqueda
  delete this.spotifySearch[id];
};

handler.command = ['spotifysearch', 'sp888'];
export default handler;
        
