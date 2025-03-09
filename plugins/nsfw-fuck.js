import { getUserName } from '../exports.js'

let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
    
    if (chat.nsfw) {
        const mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted?.sender;
    
        if (!mentionedJid) return m.reply(`${em} *Debes mencionar o etiquetar a alguien para follar*`);
        
        const senderJid = m.sender;
        
        const senderName = await getUserName(conn, senderJid);
        const mentionedName = await getUserName(conn, mentionedJid);

        // Arreglo con URLs de videos
        const videos = [
            'https://files.catbox.moe/8wgme9.mp4',
            'https://files.catbox.moe/akh0e1.mp4',
            'https://files.catbox.moe/2sletl.mp4'
        ];
        // Arreglo con textos
        const texts = [
            `🥵 *${senderName}* se folló a *${mentionedName}*`,
            `🔥 *${senderName}* se cogió fuertemente a *${mentionedName}*`,
            `😈 *${senderName}* se está follando a *${mentionedName}*`,
            `👅 *${senderName}* y *${mentionedName}* están follando apasionadamente`
        ];
        
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        
        // Enviar el mensaje con el video
        if ( mentionedJid == conn.user.jid ) {
            await conn.reply(m.chat, '🫣 Omitiremos eso', m);
        } else {
            await conn.sendMessage(m.chat, { video: { url: randomVideo }, caption: randomText, gifPlayback: true, mentions: [senderJid, mentionedJid] }, { quoted: m });    
        }
    } else {
        m.reply(`${em} *Los comandos +18 estan desactivados*`);
    }
};

handler.command = ['follar', 'fuck'];
handler.group = true;
export default handler;
