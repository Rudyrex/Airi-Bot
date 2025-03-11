import { ytdl } from 'savetubedl';  // Importar la función ytdl del módulo

let handler = async (m, { conn, text }) => {
    // Verificar si el usuario proporciona un enlace de YouTube
    if (!text) {
        return m.reply('⚠️ Por favor, proporciona un enlace de YouTube.');
    }

    try {
        // Obtener la información del video utilizando ytdl
        const videoInfo = await ytdl(text, '360'); // Obtener la calidad de video en 360p

        // Enviar toda la información como JSON
        m.reply(JSON.stringify(videoInfo, null, 2)); // Con un formato de 2 espacios de indentación
    } catch (error) {
        // En caso de error, enviar un mensaje de error
        console.error(error);
        m.reply('⚠️ Hubo un error al obtener la información del video. Asegúrate de que el enlace sea válido.');
    }
}

handler.command = ['savetube', 'videoinfo'];  // Comandos para ejecutar la función
export default handler;
