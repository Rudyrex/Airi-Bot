const handler = async (m, {isOwner, isAdmin, conn, text, participants, args, command}) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
    var sum = member.length;
  } else {
    var sum = 0;
    const total = 0;
    var member = 0;
  }
  const pesan = args.join` `;
  const oi = `${pesan}`;
  let teks = `𝐃𝐀𝐑𝐋𝐘 𝐁𝐎𝐓 ᡣ𐭩\n\n *Integrantes :  ${participants.length}* ${oi}\n\n┌──⭓ _Chicas_ 👸🏻\n`;
  for (const mem of participants) {
    teks += `🌸 @${mem.id.split('@')[0]}\n`;
  }
  teks += `└───────⭓

𝘚𝘶𝘱𝘦𝘳 𝘉𝘰𝘵 𝘥𝘦 𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 🌟`;
  conn.sendMessage(m.chat, {text: teks, mentions: participants.map((a) => a.id)} );
};
handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|marcar|todos|invocación|ta)$/i;
handler.admin = true;
handler.group = true;
export default handler;
