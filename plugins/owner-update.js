import {execSync} from "child_process";
let handler = async (m, {conn, text}) => {
  await m.reply(`⚙️ Actualizando archivos...`);
  try {
    if (global.conn.user.jid == conn.user.jid) {
      let stdout = execSync("git pull" + (m.fromMe && text ? " " + text : ""));
      await await await conn.reply(m.chat, stdout.toString(), m);
    }
  } catch {
    var update = execSync("git remote set-url origin https://github.com/Rudyrex/Airi-Bot.git && git pull");
    await await await m.reply(update.toString());
  }
};
handler.help = ["update"];
handler.tags = ["owner"];
handler.command = /^update|actualizar$/i;
handler.rowner = true;
export default handler;
