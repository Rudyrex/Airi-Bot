import db from '../lib/database.js'

import MessageType from '@whiskeysockets/baileys'
let impuesto = 0.02
let handler = async (m, { conn, text }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw '🚩 Menciona al usuario con *@user.*'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (!txt) throw '🚩 Ingrese la cantidad de *🍬 Dulces* que quiere transferir.'
    if (isNaN(txt)) throw 'Sólo números.'
    let poin = parseInt(txt)
    let limit = poin
    let imt = Math.ceil(poin * impuesto)
    limit += imt
    if (limit < 1) throw '🚩 Mínimo es *1 🍬 Dulce*.'
    let users = global.db.data.users
    if (limit > users[m.sender].limit) throw 'No tienes suficientes *🍬 Dulces* para dar.'
    users[m.sender].limit -= limit
    users[who].limit += poin
    
    await m.reply(`*${-poin}* 🍬 Dulces 
Impuesto 2% : *${-imt}* 🍬 Dulces
Total gastado: *${-limit}* 🍬 Dulces`)
    conn.fakeReply(m.chat, `*+${poin}* *🍬 Dulces.*`, who, m.text)
}
handler.help = ['dardulces *@user <cantidad>*']
handler.tags = ['rpg']
handler.command = ['dardulces', 'donardulces']
handler.register = true 

export default handler
