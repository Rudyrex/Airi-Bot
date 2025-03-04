let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
    if (chat.setCombos) {
        let combos = chat.setCombos;
        await conn.reply(m.chat, combos, m);
    } else {
        m.reply(`No se han configurado los combos`);
    }
}
handler.command = ['combos'];
handler.group = true;
export default handler
