import fs from 'fs'
let handler = async (m, { usedPrefix, command, text }) => {
let ar = Object.keys(plugins)
let ar1 = ar.map(v => v.replace('.js', ''))
if (!text) throw `*Que buscas?*\nEjemplo:\n${usedPrefix + command} sticker`
if (!ar1.includes(text)) return m.reply(`'${text}' Plugin no encontrado\n\n${ar1.map(v => ' ' + v).join`\n`}`)
m.reply(fs.readFileSync('./plugins/' + text + '.js', 'utf-8'))
}

handler.command = /^(getplugin|gp)$/i
handler.rowner = true
export default handler
