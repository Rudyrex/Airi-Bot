let handler = async (m, { conn, text, isROwner, isOwner }) => {

if (text) {
global.db.data.chats[m.chat].setCombos = text
conn.reply(m.chat, 'Los combos han sido configurados', m)

} else throw `Escribe los combos`
}


handler.command = ['setcombos'] 
handler.botAdmin = true
handler.admin = true
handler.group = true
export default handler
