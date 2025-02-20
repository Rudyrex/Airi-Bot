let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('Debes proporcionar el JID del usuario.');

    const jid = args[0].includes('@s.whatsapp.net') ? args[0] : `${args[0]}@s.whatsapp.net`;

    // Función para obtener el nombre del usuario
    async function getUserName(conn, jid) {
        let name = await conn.getName(jid); // Intenta obtener el nombre desde el store
        if (!name) {
            const contact = await conn.fetchContact(jid); // Fuerza la obtención del contacto
            name = contact?.notify || contact?.name || jid.split('@')[0];
        }
        return name;
    }

    const userName = await getUserName(conn, jid);
    m.reply(`Hola, ${userName}!`);
};

handler.command = ['hi'];
export default handler;
      
