let handler = async (m, { args }) => {
    
    if (m.quoted && m.quoted.text) {
        if (/^enc(rypt)?$/i.test(args[0])) m.reply(Buffer.from(m.quoted.text, 'utf-8').toString('base64'))
        else if (/^dec(rypt)?$/i.test(args[0])) m.reply(Buffer.from(m.quoted.text, 'base64').toString('utf-8'))
    } else if (args.length >= 2) {
        if (/^enc(rypt)?$/i.test(args[0])) m.reply(Buffer.from(args.slice(1).join(' '), 'utf-8').toString('base64'))
        else if (/^dec(rypt)?$/i.test(args[0])) m.reply(Buffer.from(args.slice(1).join(' '), 'base64').toString('utf-8'))
    } else {
        m.reply(`${em} *Agrega o responde a un texto para encriptar o desencriptar*\n\n*Uso:*\n_.base64 <enc/dec> <texto>_\n\n*Ejemplo:*\n_.base64 enc hola_`);
    }
  
}

handler.command = /^base64$/i
export default handler
