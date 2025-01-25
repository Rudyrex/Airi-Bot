//import { iconRandom } from '../exports.js';
import axios from 'axios';

let handler = async (m, { conn }) => {
    try {
        let text = `Hola 🐼🍁🥳`.trim();

        // Generar código aleatorio
        function generateRandomCode(length = 6) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let code = '';
            for (let i = 0; i < length; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return code;
        }

        const randomTitle = `✿ 𝐀𝐢𝐫𝐢 ✿ - ${generateRandomCode()}`;

        // Descargar la imagen desde la URL y convertirla a un buffer
        const thumbnailUrl = `https://qu.ax/pcNPX.jpg?random=${Date.now()}`;
        
        const thumbnailResponse = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
        const thumbnailBuffer = Buffer.from(thumbnailResponse.data);

        // Enviar mensaje con miniatura predescargada
        conn.reply(m.chat, text, m, {
            contextInfo: {
                externalAdReply: {
                    mediaUrl: null,
                    mediaType: 1,
                    description: null,
                    title: randomTitle,
                    body: 'xd',
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnail: thumbnailBuffer, // Enviar el buffer aquí
                    sourceUrl: 'https://www.windy.com/'
                }
            }
        });
    } catch (e) {
        m.reply(e.message);
    }
};

handler.command = ['test8'];
export default handler;
