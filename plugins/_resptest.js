let handler = async (m, { conn, text }) => {
    try {
        // Comprobar si el mensaje es una respuesta
        if (m.quoted) {
            // Obtener el texto del mensaje citado
            let quotedText = m.quoted.text || '';
            console.log('Texto citado:', quotedText);

            // Verificar si contiene los resultados de búsqueda
            if (quotedText.includes('YouTube Search:')) {
                console.log('El mensaje citado contiene resultados de búsqueda.');

                // Validar que el usuario ingresó un número
                if (!/^\d+$/.test(text)) {
                    console.log('Texto ingresado no es un número:', text);
                    return m.reply('Por favor, responde con un número válido correspondiente al ID de la lista.');
                }

                let id = Number(text); // Convertir texto ingresado a número
                console.log('ID ingresado:', id);

                // Extraer los enlaces del texto citado
                let links = quotedText.match(/https?:\/\/[^\s]+/g);
                console.log('Enlaces encontrados:', links);

                if (!links || links.length === 0) {
                    console.log('No se encontraron enlaces en el mensaje citado.');
                    return m.reply('No se encontraron enlaces en el mensaje citado.');
                }

                // Validar si el número ingresado está dentro del rango
                if (id < 1 || id > links.length) {
                    console.log('ID fuera de rango:', id);
                    return m.reply('El ID ingresado está fuera del rango de resultados disponibles.');
                }

                // Obtener el enlace correspondiente al ID ingresado
                let selectedLink = links[id - 1]; // Ajustar índice para que comience desde 1
                console.log('Enlace seleccionado:', selectedLink);

                // Responder con el enlace correspondiente
                return m.reply(`Aquí está el enlace correspondiente al ID ${id}:\n${selectedLink}`);
            } else {
                console.log('El mensaje citado no contiene resultados de búsqueda.');
                return m.reply('Debes responder al mensaje con los resultados de la búsqueda de YouTube.');
            }
        } else {
            console.log('El mensaje no es una respuesta válida.');
            return m.reply('Debes responder al mensaje con los resultados de la búsqueda de YouTube.');
        }
    } catch (e) {
        console.error('Error en el manejo del comando:', e);
        m.reply('Ocurrió un error procesando tu solicitud.');
    }
};

// Definir el comando
handler.customPrefix = /^\d+$/; // Escuchar mensajes que sean solo números
handler.command = new RegExp; // No se activa como comando, sino por el prefijo personalizado

export default handler;
                        
