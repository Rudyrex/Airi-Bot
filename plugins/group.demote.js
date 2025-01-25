const handler = async (m, {conn, usedPrefix, text}) => {
  if (isNaN(text) && !text.match(/@/g)) {

  } else if (isNaN(text)) {
    var number = text.split`@`[1];
  } else if (!isNaN(text)) {
    var number = text;
  }

  if (!text && !m.quoted) return conn.reply(m.chat, `*📍 𝙐𝙎𝙊 𝘼𝙋𝙍𝙊𝙋𝙄𝘼𝘿𝙊*\n\n*┯┷*\n*┠≽ ${usedPrefix}quitaradmin @tag*\n*┠≽ ${usedPrefix}quitaradmin -> 𝙧𝙚𝙨𝙥𝙤𝙣𝙙𝙚𝙧 𝙖 𝙪𝙣 𝙢𝙚𝙣𝙨𝙖𝙟𝙚*\n*┷┯*`, m);
  if (number.length > 13 || (number.length < 11 && number.length > 0)) return conn.reply(m.chat, `🧸 *𝙉𝙪𝙢𝙚𝙧𝙤 𝙌𝙪𝙚 𝙄𝙣𝙜𝙧𝙚𝙨𝙖𝙨𝙩𝙚𝙨 𝙀𝙨 𝙄𝙣𝙘𝙤𝙧𝙧𝙚𝙘𝙩𝙤*`, m);

  try {
    if (text) {
      var user = number + '@s.whatsapp.net';
    } else if (m.quoted.sender) {
      var user = m.quoted.sender;
    } else if (m.mentionedJid) {
      var user = number + '@s.whatsapp.net';
    }
  } catch (e) {
  } finally {
    conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    conn.reply(m.chat, `🚩 𝘈𝘤𝘤𝘪𝘰́𝘯 𝘳𝘦𝘢𝘭𝘪𝘻𝘢𝘥𝘢`, m);
  }
};
handler.help = ['*@usuario*'].map((v) => 'demote ' + v);
handler.tags = ['group'];
handler.command = /^(demote|quitarpoder|quitaradmin)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;
export default handler;
