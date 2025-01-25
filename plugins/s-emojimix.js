
import { sticker } from '../lib/sticker.js'


let MessageType = (await import(global.baileys)).default
import fetch from 'node-fetch'
import fs from "fs"


let handler = async (m, { conn, text, args, usedPrefix, command }) => {


if (!args[0]) return conn.reply(m.chat, `⚠️ 𝘿𝙚𝙗𝙚𝙨 𝙙𝙚 𝙪𝙨𝙖𝙧 2 𝙚𝙢𝙤𝙟𝙞𝙨 𝙮 𝙚𝙣 𝙢𝙚𝙙𝙞𝙤 𝙪𝙨𝙖𝙧 𝙚𝙡 *+*\n• 𝙀𝙟𝙚𝙢𝙥𝙡𝙤 :\n*${usedPrefix + command}* 😺+😆`, m, {contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: '✿ 𝐀𝐢𝐫𝐢 ✿', body: '𝙴𝚕 𝚖𝚎𝚓𝚘𝚛 𝚋𝚘𝚝 𝚍𝚎 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 ✅', previewType: 0, "renderLargerThumbnail": true, thumbnail: icons.getRandom(), sourceUrl: 'https://github.com/Rudyrex/Airi-Bot'}}})
try {
let [emoji1, emoji2] = text.split`+`

let packname = 'Creado por'
let autor = 'Airi-Bot'
let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
for (let res of anu.results) {
let stiker = await sticker(false, res.url, packname, autor)
conn.sendFile(m.chat, stiker, 'sticker.webp', '',m, true, { quoted: m })
}} catch (e) {
await conn.reply(m.chat, `comando fallando`, m)
console.log(`comando fallando`)
console.log(e)}}
handler.help = ['emojimix'].map(v => v + ' emot1|emot2>')
handler.tags = ['fun']
handler.command = /^(emojimix|emogimix|combinaremojis|crearemoji|emojismix|emogismix)$/i

export default handler
const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
fetch(url, options)
.then(response => response.json())
.then(json => {
resolve(json)
})
.catch((err) => {
reject(err)
})})
  
