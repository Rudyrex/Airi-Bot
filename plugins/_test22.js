import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    try {
        // Obtener el número de teléfono desde el mensaje
        const phoneNumber = text.trim(); // El número se espera como texto después del comando

        // Validar si se proporcionó un número de teléfono
        if (!phoneNumber) {
            await conn.sendMessage(m.chat, { text: 'Por favor, proporciona un número de teléfono después del comando.' });
            return;
        }

        // Convertir el número de teléfono al formato de ID de WhatsApp
        const userId = `${phoneNumber}@s.whatsapp.net`;

        // Obtener la URL de la foto de perfil
        let ppUrl = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://qu.ax/jYQH.jpg');

        // Enviar la imagen de la foto de perfil como documento
        await conn.sendMessage(m.chat, { document: { url: ppUrl }, mimetype: 'image/jpeg', fileName: `FotoPerfil_${phoneNumber}.jpg` }, { quoted: m });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { text: 'Ocurrió un error al intentar obtener la foto de perfil.' });
    }
};

handler.command = ['getpp']; // Puedes cambiar este comando si lo deseas

export default handler;
