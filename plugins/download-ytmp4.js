import fetch from 'node-fetch';

let handler = async (m, { args, conn, command }) => {
    if (!args[0]) {
        return await conn.reply(m.chat, '*Agrega un enlace de YouTube*.\n\n_Ejemplo:_\n' + `.${command} https://www.youtube.com/watch?v=abcd1234`, m);
    }

    let youtubeLink = args[0];
    
    if (!youtubeLink.includes('youtube.com') && !youtubeLink.includes('youtu.be')) {
        return await conn.reply(m.chat, '❌ *El enlace no es de YouTube.*', m);
    }

    m.react('⏳');

    try {
        // Paso 1: Inicia la descarga y obtén el ID
        const startUrl = `https://cloudseek-api.vercel.app/y2loader/start?url=${youtubeLink}&format=360`;
        const startResponse = await fetch(startUrl);
        const startResult = await startResponse.json();

        if (!startResult.status) {
            m.react('❌');
            return await conn.reply(m.chat, '❌ No se pudo iniciar la descarga.', m);
        }

        const downloadId = startResult.id;
        const title = startResult.title || 'video';

        // Paso 2: Consulta el progreso hasta obtener el enlace de descarga
        let downloadUrl = null;
        for (let i = 0; i < 20; i++) {  // Intenta durante 20 segundos
            await new Promise(resolve => setTimeout(resolve, 1000));
            const progressUrl = `https://cloudseek-api.vercel.app/y2loader/progress?id=${downloadId}`;
            const progressResponse = await fetch(progressUrl);
            const progressResult = await progressResponse.json();

            if (progressResult.status && progressResult.downloadUrl) {
                downloadUrl = progressResult.downloadUrl;
                break;
            }
        }

        if (!downloadUrl) {
            m.react('❌');
            return await conn.reply(m.chat, '❌ No se pudo obtener el enlace de descarga.', m);
        }

        // Enviar el video
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
        await conn.reply(m.chat, '❌ Ocurrió un error.', m);
    }
};

handler.command = ['ytmp4', 'ytv'];
export default handler;
            
