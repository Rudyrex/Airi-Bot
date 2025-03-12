import { apis } from '../exports.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('Por favor, ingresa un término de búsqueda.');
    }

    try {
        const response = await fetch(`${apis.delirius}search/spotify?q=${encodeURIComponent(text)}&limit=20`);
        const data = await response.json();

        if (!data.status || data.data.length === 0) {
            return m.reply('No se encontraron resultados para tu búsqueda.');
        }

        let message = `	╭  ✦ \`\`\`Spotify Search\`\`\` ✦  ╮

📥 Responde a este mensaje junto con el número del resultado que deseas.
*Ejemplo:* \`3\`\n\n`;
        data.data.forEach((track, index) => {
            message += `╭─🌱──✦\n`;
            message += `│⥤🆔 *ID:* ${index + 1}\n`;
            message += `│⥤📝 *Título:* ${track.artist} - ${track.title}\n`;
            message += `│⥤⏱️ *Duración:* ${track.duration}\n`;
            message += `│⥤📈 *Popularidad:* ${track.popularity}\n`;
            message += `│⥤🔗 *Link:* ${track.url}\n`;
            message += `╰─🌱──✦\n\n`;
        });

        m.reply(message.trim());
    } catch (err) {
        console.error(err);
        m.reply('Hubo un error al realizar la búsqueda.');
    }
};

handler.command = ['spotify', 'buscarSpotify'];
export default handler;
