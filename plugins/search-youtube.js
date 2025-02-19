
import { apis } from '../exports.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('Por favor, ingresa un término de búsqueda.');
    }

    try {
        const response = await fetch(`${apis.delirius}search/ytsearch?q=${encodeURIComponent(text)}`);
        const data = await response.json();

        if (!data.status || data.data.length === 0) {
            return m.reply('No se encontraron resultados para tu búsqueda.');
        }

        let message = '*YouTube Search:*\n\n';
        data.data.forEach((video, index) => {
            message += `╭─📹──✦\n`;
            message += `│⥤🆔 *ID:* ${index + 1}\n`;
            message += `│⥤🎵 *Título:* ${video.title}\n`;
            message += `│⥤⏱️ *Duración:* ${video.duration}\n`;
            message += `│⥤👤 *Autor:* ${video.author.name}\n`;
            message += `│⥤🔗 *Link:* ${video.url}\n`;
            message += `╰─📹──✦\n\n`;
        });

        m.reply(message.trim());
    } catch (err) {
        console.error(err);
        m.reply('Hubo un error al realizar la búsqueda.');
    }
};

handler.command = ['yts', 'ytsearch'];
export default handler;
