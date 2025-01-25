import axios from 'axios';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text }) => {
  // Crear la carpeta 'tmp' si no existe
  const tmpDir = path.join(process.cwd(), 'tmp'); // Usamos process.cwd() para la ruta raíz del proyecto
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  // Verificar que el usuario haya proporcionado un prompt
  if (!text) {
    return m.reply('Por favor, proporciona un prompt para generar la imagen.\n\nEjemplo:\n*.genimg un paisaje futurista*');
  }

  const filePath = path.join(tmpDir, 'image.png');

  const venice = {
    txt2img: async (prompt) => {
      const data = JSON.stringify({
        modelId: "fluently-xl-final-akash",
        requestId: "INlNFRX",
        prompt: prompt,
        seed: 15391382,
        negativePrompt: "",
        cfgScale: 5,
        aspectRatio: "1:1",
        width: 1024,
        height: 1024,
        customSeed: "",
        steps: 30,
        isCustomSeed: false,
        isHighRes: false,
        safeVenice: true,
        stylePreset: "",
        hideWatermark: false,
        favoriteImageStyles: [],
        stylesTab: 0,
        loraStrength: 75,
        imageToImageStrength: 50,
        clientProcessingTime: 3808,
      });

      const config = {
        method: 'POST',
        url: 'https://venice.ai/api/inference/image',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
          'Content-Type': 'application/json',
          'accept-language': 'id-ID',
          referer: 'https://venice.ai/chat',
          'x-venice-version': '20241221.032412',
          origin: 'https://venice.ai',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          priority: 'u=4',
          te: 'trailers',
        },
        responseType: 'arraybuffer',
        data: data,
      };

      const res = await axios.request(config);
      fs.writeFileSync(filePath, res.data);
      return filePath;
    }
  };

  try {
    m.reply('🖼️ Generando imagen...');
    
    // Generar la imagen
    const generatedImagePath = await venice.txt2img(text);

    // Enviar la imagen generada al chat
    await conn.sendMessage(m.chat, {
      image: { url: generatedImagePath },
      caption: `Imagen generada con el prompt: "${text}"`,
    });

    // Eliminar la imagen después de enviarla
    fs.unlinkSync(generatedImagePath);
  } catch (error) {
    console.error('Error generando la imagen:', error.message);
    m.reply('Hubo un error al generar la imagen. Inténtalo más tarde.');
  }
};

handler.command = ['genimg']; // Comando para generar la imagen
export default handler;
