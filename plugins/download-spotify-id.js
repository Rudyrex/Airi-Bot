import handlerSpotifyDL from './downloader-spotify.js'; // Importa el handler del primer código

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

            // Llamar al handler del comando spotifydl con el enlace seleccionado
            return handlerSpotifyDL(m, { conn, args: [selectedLink], command: 'spotifydl' });

        }
    } catch (e) {
        console.error('Error en el manejo del comando:', e);
        m.reply(`Ocurrió un error procesando tu solicitud.\n${e.message}`);
    }
};

// Configuración para detectar respuestas con números
handler.customPrefix = /^\d+$/;
handler.command = new RegExp;

export default handler;
                      
