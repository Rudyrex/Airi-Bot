import axios from 'axios';

let handler = async (m, { text }) => {
    if (!text) return m.reply('Por favor, proporciona una URL de YouTube.');

    try {
        // Configuración de headers simulando navegador en Android 10
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile; rv:120.0) Gecko/120.0 Firefox/120.0',
            'Accept': 'application/json',
        };

        // Primera solicitud: Obtener el ID de descarga
        const downloadUrl = `https://loader.to/ajax/download.php?format=360&url=${encodeURIComponent(text)}&api=30de256ad09118bd6b60a13de631ae2cea6e5f9d`;
        const response1 = await axios.get(downloadUrl, { headers });

        if (!response1.data.success) {
            return m.reply('No se pudo obtener el ID de descarga.');
        }

        const id = response1.data.id;
        await m.reply(`Primera solicitud completada:\n\`\`\`${JSON.stringify(response1.data, null, 2)}\`\`\``);

        // Segunda solicitud: Obtener el progreso de la descarga
        const progressUrl = `https://p.oceansaver.in/api/progress?id=${id}`;
        const response2 = await axios.get(progressUrl, { headers });

        m.reply(`Segunda solicitud completada:\n\`\`\`${JSON.stringify(response2.data, null, 2)}\`\`\``);

    } catch (error) {
        console.error(error);
        m.reply('Ocurrió un error al realizar las solicitudes.');
    }
};

handler.command = ['dl888'];
export default handler;
