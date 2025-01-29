import { apis } from '../exports.js';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
    try {
        if (!m.quoted) {
            console.log('El mensaje no es una respuesta válida.');
            return m.reply('Debes responder al mensaje con los resultados de la búsqueda de Spotify.');
        }

        let quotedText = m.quoted.text || '';
        console.log('Texto citado:', quotedText);

        if (!quotedText.includes('Spotify Search:')) {
            console.log('El mensaje citado no contiene resultados de búsqueda de Spotify.');
            return m.reply('Debes responder al mensaje con los resultados de la búsqueda de Spotify.');
        }

        let userInput = m.text.trim();
        console.log('Texto ingresado por el usuario:', userInput);

        if (!/^\d+$/.test(userInput)) {
            console.log('Texto ingresado no es un número:', userInput);
            return m.reply('Por favor, responde con un número válido correspondiente al ID de la lista.');
        }

        let id = Number(userInput);
        console.log('ID ingresado:', id);

        let links = quotedText.match(/https?:\/\/open\.spotify\.com\/track\/[^\s]+/g);
        console.log('Enlaces encontrados:', links);

        if (!links || links.length === 0) {
            console.log('No se encontraron enlaces en el mensaje citado.');
            return m.reply('No se encontraron enlaces en el mensaje citado.');
        }

        if (id < 1 || id > links.length) {
            console.log('ID fuera de rango:', id);
            return m.reply('El ID ingresado está fuera del rango de resultados disponibles.');
        }

        let selectedLink = links[id - 1];
        console.log('Enlace seleccionado:', selectedLink);

        m.react('⏳');

        const apisToTry = [
            `${apis.delirius}download/spotifydl?url=${encodeURIComponent(selectedLink)}`,
            `${apis.delirius}download/spotifydlv3?url=${encodeURIComponent(selectedLink)}`,
            `${apis.rioo}api/spotify?url=${encodeURIComponent(selectedLink)}`,
            `${apis.ryzen}api/downloader/spotify?url=${encodeURIComponent(selectedLink)}`
        ];

        let success = false;
        for (const api of apisToTry) {
            try {
                const response = await fetch(api);
                const result = await response.json();
                const downloadUrl = result.data?.url || result.data?.response || result.link;

                if (downloadUrl) {
                    await conn.sendMessage(m.chat, {
                        audio: { url: downloadUrl },
                        fileName: 'spotify_audio.mp3',
                        mimetype: 'audio/mpeg',
                        quoted: m,
                    });
                    success = true;
                    break;
                }
            } catch (error) {
                console.log(`Error al usar la API: ${api}`, error);
            }
        }

        if (!success) {
            m.react('❌');
            conn.reply(m.chat, `*[ ❌ ]* Ocurrió un error al descargar el archivo mp3, inténtalo más tarde.`, m);
        }

    } catch (e) {
        console.error('Error en el manejo del comando:', e);
        m.reply('Ocurrió un error procesando tu solicitud.');
    }
};

handler.customPrefix = /^\d+$/;
handler.command = new RegExp;

export default handler;
                           
