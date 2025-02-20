import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurarse de que la carpeta tmp exista
const tmpDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

let handler = async (m, { conn }) => {
    if (!m.mentionedJid[0]) return m.reply('Debes mencionar a alguien para lamer.');

    const senderJid = m.sender;
    const mentionedJid = m.mentionedJid[0];

    // Obtener el nombre del usuario
    async function getUserName(conn, jid) {
        let name = await conn.getName(jid);
        if (!name) {
            const contact = await conn.fetchContact(jid);
            name = contact?.notify || contact?.name || jid.split('@')[0];
        }
        return name;
    }

    const senderName = await getUserName(conn, senderJid);
    const mentionedName = await getUserName(conn, mentionedJid);

    // Descargar el GIF y guardarlo temporalmente en /tmp
    const gifUrl = 'https://api.waifu.pics/sfw/lick';
    const tempPath = path.join(tmpDir, `${Date.now()}.gif`);

    try {
        const response = await fetch(gifUrl);
        const { url } = await response.json();

        const gifRes = await fetch(url);
        const buffer = await gifRes.buffer();
        fs.writeFileSync(tempPath, buffer);

        // Enviar el GIF como video para reproducción automática
        await conn.sendMessage(m.chat, {
            video: fs.readFileSync(tempPath),
            gifPlayback: true,
            caption: `👅 *${senderName}* lamió a *${mentionedName}* 🤤`,
            mentions: [senderJid, mentionedJid]
        }, { quoted: m });

        // Borrar el archivo temporal
        fs.unlinkSync(tempPath);
    } catch (error) {
        console.error('Error al enviar el GIF:', error);
        m.reply('Ocurrió un error al obtener o enviar el GIF.');
    }
};

handler.command = ['lick'];
export default handler;
        
