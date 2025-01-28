let handler = async (m, { conn }) => {
  if (!m.quoted || !m.quoted.text) throw `✳️ Responde al mensaje del bot con el número del video para obtener la URL.`
  if (m.quoted.sender !== conn.user.jid) throw `✳️ Solo puedes responder a mensajes enviados por el bot.`

  let num = m.text.match(/\d+/) 
  if (!num) throw `✳️ Ingresa un número válido.`
  
  let number = parseInt(num[0])
  if (isNaN(number) || number < 1) throw `✳️ Ingresa un número válido.`
  let lines = m.quoted.text.split('\n')
  let startIndex = lines.findIndex(line => line.startsWith(`╭─🌱──✦ ${number}`))
  if (startIndex === -1) throw `✳️ No se encontró un video con ese número.`
  let videoBlock = lines.slice(startIndex, startIndex + 6) 
  let urll = videoBlock.find(line => line.includes('*Link:*'))
  
  if (!urll) throw `✳️ No se pudo extraer la URL del video.`

  let url = urll.replace(/.*\*Link:\*\s*/, '').trim()
  m.reply(`🔗 La URL del video seleccionado es: ${url}`)
}
handler.customPrefix = /^(dl|Dl|DL|dL)/
handler.command = new RegExp

export default handler