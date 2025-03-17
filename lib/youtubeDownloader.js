import axios from 'axios';

/**
 * Obtiene los enlaces de descarga de un video de YouTube.
 * @param {string} videoUrl - URL del video de YouTube.
 * @returns {Promise<object>} - Información del video y enlaces de descarga.
 */
export async function getYoutubeDownloadLinks(videoUrl) {
  try {
    if (!videoUrl || !videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      throw new Error('URL inválida. Asegúrate de que sea un enlace de YouTube.');
    }

    // API de SSYouTube
    const apiUrl = 'https://api.ssyoutube.com/api/convert';
    const response = await axios.post(apiUrl, { url: videoUrl });

    if (!response.data || response.data.error) {
      throw new Error(response.data.error || 'Error al obtener los enlaces de descarga.');
    }

    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener enlaces: ${error.message}`);
  }
}
