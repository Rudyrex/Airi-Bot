import { ytdl } from 'savetubedl';
import fetch from 'node-fetch';

const getYoutubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
};

let handler = async (m, { text, conn, args, usedPrefix, command }) => {
    if (!args[0]) return await conn.reply(m.chat, `${em} *Agrega un enlace de YouTube*_\n\n_Ejemplo:_\n.${command} https://www.youtube.com`, m);
    
    let youtubeLink = '';
    
    if (args[0].includes('you')) {
        youtubeLink = args[0];
    } else {
        return await conn.reply(m.chat, `${em} *El enlace no es de YouTube*`, m);
    }
    
    
    const isShort = youtubeLink.includes('youtube.com/shorts/');
    const videoId = getYoutubeId(youtubeLink);
    
    
    const shortYoutubeUrl = isShort ? youtubeLink : `https://youtu.be/${videoId}`;
    
    m.react('⏳');
    
    try {
    //╔────── ¤ ◎ savetubedl ◎ ¤ ──────╗
        let result = await ytdl(shortYoutubeUrl, '360');
        let title = result.response.titulo;
        let downloadUrl = result.response.descarga;
        await conn.sendMessage(m.chat, {document: {url: downloadUrl}, caption: null, mimetype: 'video/mp4', fileName: `${title}.mp4`}, {quoted: m});
    //╚────── ¤ ◎ node-yt-dl ◎ ¤ ──────╝
    } catch (e1) {
        m.react('❌');
    }
};

handler.command = ['ytmp4', 'ytv'];
export default handler;
                                                                                                                                        
