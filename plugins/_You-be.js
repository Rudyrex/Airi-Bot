
import { getYoutubeDownloadLinks } from '../lib/youtubeDownloader.js';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply('Por favor, envíame una URL de YouTube para descargar el video.');
  }

  try {
    // Llamamos a la función de descarga de YouTube con la URL proporcionada
    const resultado = await getYoutubeDownloadLinks(text);

    // Comprobamos si la información del video es válida
    if (resultado && resultado.title && resultado.links) {
      // Generamos el mensaje con los resultados obtenidos
      let message = `*Información del video:*\n`;
      message += `*Título:* ${resultado.title}\n`;
      message += `*Enlaces de descarga:* \n`;

      // Agregamos los enlaces de descarga
resultado.links.forEach((link, index) => 
        message += `{index + 1}. ${link}\n`;
      });

      // Enviamos el mensaje con los resultados
      m.reply(message);
    } else {
      m.reply('No se pudo obtener la información del video. Intenta nuevamente.');
    }
  } catch (error) {
    // En caso de error, enviamos un mensaje de error
    console.error('Error al obtener el video:', error.message);
    m.reply('Hubo un error al intentar obtener la información del video. Intenta nuevamente.');
  }
}

handler.command = ['descargarvideo', 'youtube'];
export default handler;
        
