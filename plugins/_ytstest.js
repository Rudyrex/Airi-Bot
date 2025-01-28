import yts from 'yt-search';

let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('Por favor, ingresa un término de búsqueda.');
    }

    try {
        const results = await yts(text);
        const videos = results.videos.slice(0, 10); // Obtener solo los primeros 10 resultados.

        if (videos.length === 0) {
            return m.reply('No se encontraron resultados para tu búsqueda.');
        }

        let message = 'YouTube Search:\n\n';
        videos.forEach((video, index) => {
            message += `╭─🌱──✦\n`;
            message += `│⥤🆔 *ID:* ${index + 1}\n`;
            message += `│⥤📝 *Titulo:* ${video.title}\n`;
            message += `│⥤⏱️ *Duración:* ${video.timestamp}\n`;
            message += `│⥤🌐 *Publicado:* ${video.ago}\n`;
            message += `│⥤🔗 *Link:* ${video.url}\n`;
            message += `╰─🌱──✦\n\n`;
        });

        m.reply(message.trim());
    } catch (err) {
        console.error(err);
        m.reply('Hubo un error al realizar la búsqueda.');
    }
};

handler.command = ['youtube99', 'buscar99'];
export default handler;
