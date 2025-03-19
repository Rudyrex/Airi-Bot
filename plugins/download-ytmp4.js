import fetch from 'node-fetch';


const getYoutubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
};

let handler = async (m, { text, conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return await conn.reply(m.chat, '*Agrega un enlace de YouTube*.\n\n_Ejemplo:_\n' + `.${command} https://www.youtube.com/watch?v=abcd1234`, m);
    }
    
    let youtubeLink = args[0];
    
    if (!youtubeLink.includes('youtube.com') && !youtubeLink.includes('youtu.be')) {
        return await conn.reply(m.chat, `${em} *El enlace no es de YouTube.*`, m);
    }

    const isShort = youtubeLink.includes('youtube.com/shorts/');
    const videoId = getYoutubeId(youtubeLink);
    const shortYoutubeUrl = isShort ? youtubeLink : `https://youtu.be/${videoId}`;

    m.react('⏳');

    try {
        
        const apiUrl = `https://cloudseek-api.vercel.app/y2loader?url=${shortYoutubeUrl}&format=360`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (!result.status) {
            m.react('❌');
            return await conn.reply(m.chat, '❌ No se pudo obtener el enlace de descarga.', m);
        }

        let title = result.title || 'video';
        let downloadUrl = result.downloadUrl;

        
        await conn.sendMessage(
            m.chat, 
            { 
                document: { url: downloadUrl },
                mimetype: 'video/mp4', 
                fileName: `${title}.mp4`
            }, 
            { quoted: m }
        );

        m.react('✅');
    } catch (e) {
        console.error(e);
        m.react('❌');
    }
};

handler.command = ['ytmp4', 'ytv'];
export default handler;
        
