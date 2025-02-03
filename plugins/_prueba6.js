let handler = async (m, { conn, args}) => {
    let url = args[0]; // Extrae los argumentos
    //let mensaje = args.length ? args.join(' ') : 'No recibí ningún texto.';

    try {
        m.reply(`📩 Recibí: ${url}`);
    } catch (error) {
        m.reply(`❌ Error en prueba6: ${error.message}`);
    }
}

handler.command = ['prueba6'];
export default handler;
