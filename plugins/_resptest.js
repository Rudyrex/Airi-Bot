let handler = async (m, { conn, text }) => {
    try {
        // Verifica si el mensaje es una respuesta a un mensaje con los resultados
        if (m.quoted && conn.user.jid === m.quoted.sender && m.quoted.body.includes('YouTube Search:')) {
            // Validar que el usuario ingresó un número
            if (!/^\d+$/.test(text)) {
                return m.reply('Por favor, responde con un número válido correspondiente al ID de la lista.');
            }

            let id = Number(text); // Convertir texto ingresado a número

            // Extraer los enlaces del mensaje citado
            let links = m.quoted.body.match(/https?:\/\/[^\s]+/g);
            if (!links || links.length === 0) {
                return m.reply('No se encontraron enlaces en el mensaje citado.');
            }

            // Validar si el número ingresado está dentro del rango
            if (id < 1 || id > links.length) {
                return m.reply('El ID ingresado está fuera del rango de resultados disponibles.');
            }

            // Obtener el enlace correspondiente al ID ingresado
            let selectedLink = links[id - 1]; // Ajustar índice para que comience desde 1

            // Responder con el enlace correspondiente
            return m.reply(`Aquí está el enlace correspondiente al ID ${id}:\n${selectedLink}`);
        } else {
            // Mensaje de error si no se responde al mensaje correcto
            return m.reply('Debes responder al mensaje con los resultados de la búsqueda de YouTube.');
        }
    } catch (e) {
        console.error(e);
        m.reply('Ocurrió un error procesando tu solicitud.');
    }
};

// Definir el comando
handler.customPrefix = /^\d+$/; // Escuchar mensajes que sean solo números
handler.command = new RegExp; // No se activa como comando, sino por el prefijo personalizado

export default handler;
