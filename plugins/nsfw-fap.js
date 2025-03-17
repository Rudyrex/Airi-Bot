import { getUserName } from '../exports.js'

let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]
    
    if (chat.nsfw) {
        const mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted?.sender;
    
        if (!mentionedJid) return m.reply(`${em} *Debes mencionar o etiquetar a alguien para pajearte*`);
        
        const senderJid = m.sender;
        
        const senderName = await getUserName(conn, senderJid);
        const mentionedName = await getUserName(conn, mentionedJid);

        // Arreglo con URLs de videos
        const videos = [
            'https://qu.ax/RsacA.mp4',
            'https://qu.ax/EWGNt.mp4',
            'https://qu.ax/HlMyg.mp4',
            'https://qu.ax/obGps.mp4'
        ];
        // Arreglo con textos
        const texts = [
            `🥵 *${senderName}* se la jaló pensando en *${mentionedName}*`,
            `🥵 *${senderName}* se está masturbando pensando en *${mentionedName}*`,
            `😈 *${senderName}* le dedicó una paja a *${mentionedName}*`,
            `👅 *${senderName}* se la jaló y se corrió imaginando a *${mentionedName}*`
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

handler.command = ['fap', 'paja'];
handler.group = true;
export default handler;
