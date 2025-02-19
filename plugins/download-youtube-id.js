import handlerYtmp3 from './download-ytmp3.js'; // Importa el handler para audio
import handlerYtmp4 from './download-ytmp4.js'; // Importa el handler para video

const handler = async (m, { conn }) => {
    try {
        if (m.quoted && conn.user.jid === m.quoted.sender && m.quoted.text.includes('YouTube Search')) {
            let quotedText = m.quoted.text || '';
            let userInput = m.text.trim().toLowerCase();

            // Aceptar 'a1', 'v2', 'a 1', 'v 2'
            let match = userInput.match(/^([av])\s*(\d+)$/);
            if (!match) {
                return m.reply('⚠️ Responde con el formato correcto:\n- `a1` o `a 1` para audio\n- `v2` o `v 2` para video');
            }

            let [_, type, number] = match;
            let id = Number(number);

            // Extraer enlaces de YouTube
            let links = quotedText.match(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[^\s]+/g);
            if (!links || links.length === 0) {
                return m.reply('No se encontraron enlaces en el mensaje citado.');
            }

            if (id < 1 || id > links.length) {
                return m.reply(`⚠️ El número ingresado está fuera del rango. Selecciona un número entre 1 y ${links.length}.`);
            }

            let selectedLink = links[id - 1];

            // Llamar al handler correspondiente según el tipo
            if (type === 'a') {
                return handlerYtmp3(m, { conn, args: [selectedLink], command: 'ytmp3' });
            } else {
                return handlerYtmp4(m, { conn, args: [selectedLink], command: 'ytmp4' });
            }
        }
    } catch (e) {
        console.error('Error en el manejo del comando YouTube:', e);
        m.reply(`Ocurrió un error procesando tu solicitud.\n${e.message}`);
    }
};

// Detectar respuestas tipo a1, a 1, v2, v 2
handler.customPrefix = /^[av]\s*\d+$/i;
handler.command = new RegExp;

export default handler;
