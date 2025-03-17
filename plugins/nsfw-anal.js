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
            'https://telegra.ph/file/a11625fef11d628d3c8df.mp4',
            'https://qu.ax/ieJeB.mp4',
            'https://qu.ax/kBzBB.mp4',
            'https://qu.ax/eqQHs.mp4'
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
            await conn.sendMessage(m.chat, { video: { url: randomVideo },  caption: randomText, gifPlayback: true, mentions: [senderJid, mentionedJid] }, { quoted: m });    
        }
    } else {
        m.reply(`${em} *Los comandos +18 estan desactivados*`);
    }
};

handler.command = ['anal'];
handler.group = true;
export default handler;
        
