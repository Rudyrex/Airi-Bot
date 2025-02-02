let handler = async (m) => {
    let args = m.text.split(' ').slice(1); // Extrae los argumentos
    let mensaje = args.length ? args.join(' ') : 'No recibí ningún texto.';

    try {
        m.reply(`📩 Recibí: ${mensaje}`);
    } catch (error) {
        m.reply(`❌ Error en prueba6: ${error.message}`);
    }
}

handler.command = ['prueba6'];
export default handler;
