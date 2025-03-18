import axios from 'axios';

let handler = async (m, { conn, args }) => {
    const videoUrl = args[0];

    if (!videoUrl) {
        return m.reply("Por favor, proporciona la URL del video de YouTube.");
    }

    try {
        
        const response1 = await axios.get(`https://loader.to/ajax/download.php`, {
            params: {
                format: '360',
                url: encodeURIComponent(videoUrl),
                api: '30de256ad09118bd6b60a13de631ae2cea6e5f9d'
            }
        });

        
        const data1 = response1.data;
        if (data1.success && data1.id) {
            const videoId = data1.id;

            
            const response2 = await axios.get(`https://p.oceansaver.in/api/progress`, {
            params: { id: videoId }
            });

            
            const data2 = response2.data;

            
            m.reply(`*Respuesta de la primera solicitud (loader.to):*\n\n\`\`\`json\nJSON.stringify(data1, null, 2)̀̀`̀);
            m.reply(`*Respuesta de la segunda solicitud (oceansaver):*̀̀j̀son{JSON.stringify(data2, null, 2)}\n\`\`\``);
        } else {
            m.reply("No se pudo obtener información del video.");
        }
    } catch (error) {
        console.error(error);
        m.reply("Hubo un error al procesar la solicitud.");
    }
};

handler.command = ['dlyt88'];
export default handler;
