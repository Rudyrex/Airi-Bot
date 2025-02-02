import { apis } from '../exports.js';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
    try {
        if (m.quoted && conn.user.jid === m.quoted.sender && m.quoted.text.includes('Spotify Search')) {

            let quotedText = m.quoted.text || '';
            let userInput = m.text.trim();
            

            if (!/^\d+$/.test(userInput)) {
                console.log('Texto ingresado no es un número:', userInput);
                return m.reply('⚠️ Responde con un número válido correspondiente al ID de la lista.');
            }

            let id = Number(userInput);

            let links = quotedText.match(/https?:\/\/open\.spotify\.com\/track\/[^\s]+/g);

            if (!links || links.length === 0) {
                return m.reply('No se encontraron enlaces en el mensaje citado.');
            }

            if (id < 1 || id > links.length) {
                return m.reply('⚠️ El ID ingresado está fuera del rango de resultados disponibles.');
            }

            let selectedLink = links[id - 1];

//----------------------------------------------
            /*
            let commandName = 'downloader-spotify.js'; // Nombre del archivo del comando
            let cmd = global.plugins?.[commandName]; // Buscar el comando

            if (cmd) {
                let fakeMessage = { ...m, text: `.spotifydl ${selectedLink}` }; // Simula el mensaje con argumentos
                await cmd(fakeMessage, { conn }); // Ejecuta el comando con los datos modificados
            } else {
                console.log('El comando no está disponible.');
            }
            */
//----------------------------------------------

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
                            quoted: m
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

//----------------------------------------------


        }
    } catch (e) {
        console.error('Error en el manejo del comando:', e);
        m.reply(`Ocurrió un error procesando tu solicitud.\n${e.message}`);
    }
};

handler.customPrefix = /^\d+$/;
handler.command = new RegExp;

export default handler;
            
