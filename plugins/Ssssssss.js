import axios from 'axios';

async function downloadVideo(format, videoUrl, apiKey) {
  try {
    // Inicia la descarga
    const response = await axios.get('https://loader.to/ajax/download.php', {
      params: {
        format,
        url: videoUrl, // Enviar directamente sin encodeURIComponent
        api: apiKey
      }
    });

    if (response.status !== 200) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const data = response.data;

    if (!data.success) {
      throw new Error(`Error al iniciar la descarga: ${data.text}`);
    }

    const downloadId = data.id;
    let progress = 0;

    // Espera hasta que el progreso llegue a 1000 o que el link de descarga esté disponible
    while (progress < 1000) {
      const progressResponse = await axios.get('https://p.oceansaver.in/ajax/progress.php', {
        params: { id: downloadId }
      });

      const progressData = progressResponse.data;
      progress = progressData.progress;

      if (progressData.success === 1 && progressData.download_url) {
        return progressData.download_url;
      }

      // Espera 3 segundos antes de revisar de nuevo
      await new Promise(res => setTimeout(res, 3000));
    }

    throw new Error('La descarga no se completó.');
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

let handler = async (m, { conn, args }) => {
  if (args.length < 2) {
    return m.reply('Uso: *!descargar [formato] [url]*\nEjemplo: *!descargar mp3 https://www.youtube.com/watch?v=abcd1234*');
  }

  const [format, videoUrl] = args;
  const apiKey = 'fbac049a63e8cc81f918214fb3407db067b3beca';

  m.reply('⏳ Iniciando descarga...');

  const downloadUrl = await downloadVideo(format, videoUrl, apiKey);

  if (downloadUrl) {
    m.reply(`✅ Descarga lista: ${downloadUrl}`);
  } else {
    m.reply('❌ Hubo un error al descargar el video.');
  }
};

handler.command = ['desyt'];
export default handler;

