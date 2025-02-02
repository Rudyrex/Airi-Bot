let handler = async (m, { conn, usedPrefix, text }) => {
    let commandName = 'prueba6.js'; // Nombre del archivo del comando
    let cmd = global.plugins?.[commandName]; // Buscar el comando

    if (!cmd) {
        return m.reply('⚠️ Error: El comando .prueba6 no está disponible.');
    }

    let fakeMessage = { ...m, text: `${usedPrefix}prueba6 ${text || 'Sin texto'}` };

    try {
        await cmd(fakeMessage, { conn, usedPrefix });
        m.reply('✅ Se ejecutó .prueba6 correctamente.');
    } catch (error) {
        m.reply(`❌ Error al ejecutar .prueba6: ${error.message}`);
    }
}

handler.command = ['prueba5'];
export default handler;
