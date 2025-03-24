import axios from 'axios';

let handler = async (m, { args, conn }) => {
    if (!args[0]) return await conn.reply(m.chat, '⚠️ Agrega un enlace de Youtube', m);
    
    let yturl = args[0];
    m.react('⏳');

    try {
        const response = await axios.get(`https://api.fabdl.com/youtube/get?url=${encodeURIComponent(yturl)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 10; es; M2006C3LG Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.0.0 Mobile Safari/537.36'
            }
        });

        const result = response.data.result;
        console.log(result);
        //if (!result) throw new Error('No se pudo obtener información del video.');

        const downloadUrl = result.videos?.[0]?.url;
        const title = result.title || 'video';

        if (!downloadUrl) throw new Error('No se encontró un enlace de descarga.');

        m.react('✅');
        await conn.sendMessage(m.chat, {
            document: { url: downloadUrl },
            caption: null,
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`
        }, { quoted: m });
        
    } catch (error) {
        console.error(error);
        m.react('❌');
        await conn.reply(m.chat, '❌ Ocurrió un error al obtener el video.', m);
    }
};

handler.command = ['apiyt2'];
export default handler;
