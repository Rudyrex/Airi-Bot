import fetch from 'node-fetch';

let handler = async (m, { text, conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return await conn.reply(m.chat, '*Agrega un enlace de YouTube*.\n\n_Ejemplo:_\n' + `.${command} https://www.youtube.com/watch?v=abcd1234`, m);
    }
    
    let youtubeLink = args[0];
    
    if (!youtubeLink.includes('youtube.com') && !youtubeLink.includes('youtu.be')) {
        return await conn.reply(m.chat, `${em} *El enlace no es de YouTube.*`, m);
    }

    
    m.react('⏳');

    try {
        
        const apiUrl = `https://cloudseek-api.vercel.app/y2loader?url=${youtubeLink}&format=mp3`;
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
                mimetype: 'audio/mpeg', 
                fileName: `${title}.mp3`
            }, 
            { quoted: m }
        );

        m.react('✅');
    } catch (e) {
        console.error(e);
        m.react('❌');
    }
};

handler.command = ['ytmp3', 'yta'];
export default handler;
        
