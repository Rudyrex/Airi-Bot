import { apis } from '../exports.js';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
    try {
        if (m.quoted && conn.user.jid === m.quoted.sender && m.quoted.text.includes('Spotify Search')) {
            let quotedText = m.quoted.text || '';
            let userInput = m.text.trim();

            if (!/^\d+$/.test(userInput)) {
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

            // ----------------- BUSCAR EL COMANDO AUTOMÁTICAMENTE -----------------
            let cmd = Object.values(global.plugins).find(plugin => {
                let commands = Array.isArray(plugin.command) ? plugin.command : [];
                return commands.includes('spotifydl');
            });

            if (!cmd) {
                return m.reply('⚠️ Error: El comando .spotifydl no está disponible.');
            }

            let fakeMessage = Object.create(m); // Clonar mensaje manteniendo métodos
            fakeMessage.text = `.spotifydl ${selectedLink}`; // Prefijo fijo en lugar de usedPrefix

            try {
                await cmd(fakeMessage, { conn });
                m.reply('✅ Se ejecutó .spotifydl correctamente.');
            } catch (error) {
                m.reply(`❌ Error al ejecutar .spotifydl: ${error.message}`);
            }
        }
    } catch (e) {
        console.error('Error en el manejo del comando:', e);
        m.reply(`Ocurrió un error procesando tu solicitud.\n${e.message}`);
    }
};

handler.customPrefix = /^\d+$/;
handler.command = new RegExp;

export default handler;
        
