
import { apis } from '../exports.js';
import axios from 'axios';

const handler = async (m, {conn, args, command, usedPrefix}) => {
    if (!args[0]) return conn.reply(m.chat,`_*[ ⚠️ ] Agrega el enlace de un video o una publicación de Instagram*_\n\n> Ejemplo:\n.${command} https://www.instagram.com`, m);
    
    await conn.reply(m.chat, '_*[ ⏳ ] Descargando...*_', m);
    try {
        const responseIg = await axios.get(`${apis.delirius}download/instagram?url=${args[0]}`);
        const resultlIg = responseIg.data;

        for (const item of resultlIg.data) {
            await conn.sendFile(m.chat, item.url, `file.${item.type === 'video' ? 'mp4' : 'jpg'}`, ``, m);
        }
    } catch (e) {
        conn.sendMessage(m.chat, '_*[ ❌ ] Ocurrió un error, inténtalo más tarde*_', m);
        console.log(e);
    }
};


handler.command = ['instagram', 'ig'];

export default handler;
