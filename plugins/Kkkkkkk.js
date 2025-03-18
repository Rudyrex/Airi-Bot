import axios from 'axios';

let handler = async (m, { text }) => {
    if (!text) return m.reply('Por favor, proporciona una URL de YouTube.');

    try {
        // Primera solicitud: Obtener el ID de descarga
        const downloadUrl = `https://loader.to/ajax/download.php?format=360&url=${encodeURIComponent(text)}&api=30de256ad09118bd6b60a13de631ae2cea6e5f9d`;
        const response1 = await axios.get(downloadUrl);

        if (!response1.data || !response1.data.id) {
            console.log('Respuesta 1:', response1.data);
            return m.reply('No se pudo obtener el ID de descarga.');
        }

        const id = response1.data.id;
        await m.reply(`ID obtenido: ${id}\n\`\`\`${JSON.stringify(response1.data, null, 2)}\`\`\``);

        // Segunda solicitud: Obtener el progreso de la descarga
        const progressUrl = `https://p.oceansaver.in/api/progress?id=${id}`;
        const response2 = await axios.get(progressUrl);

        m.reply(`Progreso obtenido:\n\`\`\`${JSON.stringify(response2.data, null, 2)}\`\`\``);

    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        m.reply('Ocurrió un error al realizar las solicitudes.');
    }
};

handler.command = ['d988'];
export default handler;
        
