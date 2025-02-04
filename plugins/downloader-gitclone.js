import fetch from 'node-fetch'
const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args[0]) return m.reply(`${em} Ingresa el enlace del repositorio de GitHub`)
try {
if (!regex.test(args[0])) return `La Url es invalida.`
let [_, user, repo] = args[0].match(regex) || []
repo = repo.replace(/.git$/, '')
let url = `https://api.github.com/repos/${user}/${repo}/zipball`
let filename = (await fetch(url, { method: 'HEAD' })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
await conn.sendFile(m.chat, url, filename, null, m)
} catch {
}}

handler.command = ['gitclone'] 

export default handler
