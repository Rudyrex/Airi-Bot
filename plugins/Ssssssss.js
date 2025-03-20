import axios from 'axios';

async function downloadVideo(format, videoUrl, apiKey, m) {
  try {
    m.reply('🚀 Iniciando solicitud de descarga...');

    // Inicia la descarga
    const response = await axios.get('https://loader.to/ajax/download.php', {
      params: {
        format,
        url: videoUrl,
        api: apiKey
      }
    });

    if (response.status !== 200) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const data = response.data;
    m.reply(`📥 Respuesta de inicio de descarga:\n\`\`\`${JSON.stringify(data, null, 2)}\`\`\``);

    if (!data.success) {
      throw new Error(`Error al iniciar la descarga: ${data.text}`);
    }

    const downloadId = data.id;
    let progress = 0;

    m.reply(`⏳ Descarga iniciada. ID: ${downloadId}`);

    // Espera hasta que el progreso llegue a 1000 o que el link de descarga esté disponible
    while (progress < 1000) {
      const progressResponse = await axios.get('https://p.oceansaver.in/ajax/progress.php', {
        params: { id: downloadId }
      });

      const progressData = progressResponse.data;
      progress = progressData.progress;

      m.reply(`📊 Progreso: ${progress}\n\`\`\`${JSON.stringify(progressData, null, 2)}\`\`\``);

      if (progressData.success === 1 && progressData.download_url) {
        m.reply(`✅ Enlace de descarga obtenido: ${progressData.download_url}`);
        return progressData.download_url;
      }

      // Espera 3 segundos antes de revisar de nuevo
      await new Promise(res => setTimeout(res, 3000));
    }

    throw new Error('La descarga no se completó.');
  } catch (error) {
    m.reply(`❌ Error: ${error.message}`);
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

  const downloadUrl = await downloadVideo(format, videoUrl, apiKey, m);

  if (downloadUrl) {
    m.reply(`✅ Descarga lista: ${downloadUrl}`);
  } else {
    m.reply('❌ Hubo un error al descargar el video.');
  }
};

handler.command = ['descargar'];
export default handler;
  
