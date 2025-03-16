import { getUserName } from '../exports.js'

let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
    
    if (chat.nsfw) {
        const mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted?.sender;
    
        if (!mentionedJid) return m.reply(`${em} *Debes mencionar o etiquetar a alguien para hacerle un anal*`);
        
        const senderJid = m.sender;
        
        const senderName = await getUserName(conn, senderJid);
        const mentionedName = await getUserName(conn, mentionedJid);

        // Arreglo con URLs de videos
        const videos = [
            'https://cdn2.hentaigifz.com/84578/working-on-getting-that-a-in-class.gif'
        ];
        // Arreglo con textos
        const texts = [
            `🥵 *${senderName}* le hizo un anal a *${mentionedName}*`,
            `🔥 *${senderName}* le destrozó el ano a *${mentionedName}*`,
            `😈 *${senderName}* se la metió en el ano a *${mentionedName}*`,
            `👅 *${senderName}* le penetro el ano varias veces a *${mentionedName}*`,
            `🥵 *${mentionedName}* dejó que ${senderName} le metiera la verga en el ano`
        ];
        
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        
        // Enviar el mensaje con el video
        if ( mentionedJid == conn.user.jid ) {
            await conn.reply(m.chat, '🫣 Omitiremos eso', m);
        } else {
            await conn.sendMessage(m.chat, { video: { url: randomVideo }, fileName: `video.mp4`, mimetype: 'video/mp4', caption: randomText, gifPlayback: true, mentions: [senderJid, mentionedJid] }, { quoted: m });    
        }
    } else {
        m.reply(`${em} *Los comandos +18 estan desactivados*`);
    }
};

handler.command = ['anal'];
handler.group = true;
export default handler;
