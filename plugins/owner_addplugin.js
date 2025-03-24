import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

let exec = promisify(_exec).bind(cp);

let handler = async (m, { conn, isROwner, usedPrefix, command, text }) => {
    if (text=='') {
       m.reply(`*[❗]  𝙸𝙽𝙶𝚁𝙴𝚂𝙴 𝙴𝙻 𝙽𝙾𝙼𝙱𝚁𝙴 𝚈 𝙴𝙻 𝙲𝙾́𝙳𝙸𝙶𝙾 𝙹𝙰𝚅𝙰𝚂𝙲𝚁𝙸𝙿𝚃 𝙿𝙰𝚁𝙰 𝙴𝙻 𝙿𝙻𝚄𝙶𝙸𝙽 𝚀𝚄𝙴 𝙳𝙴𝚂𝙴𝙰 𝙲𝚁𝙴𝙰𝚁.*

*𝚂𝙸 𝙴𝚇𝙸𝚂𝚃𝙴 𝚄𝙽 𝙰𝚁𝙲𝙷𝙸𝚅𝙾 𝙲𝙾𝙽 𝙴𝙻 𝙼𝙸𝚂𝙼𝙾 𝙽𝙾𝙼𝙱𝚁𝙴, 𝚂𝙴𝚁𝙰́ 𝚁𝙴𝙴𝙼𝙿𝙻𝙰𝚉𝙰𝙳𝙾.*

*𝙴𝙹𝙴𝙼𝙿𝙻𝙾𝚂 𝙳𝙴 𝚄𝚂𝙾:*

*.addplugin* <nombre> <script>

*.addplugin* hola-mundo let handler = async (m, { conn }) => {
        m.reply(`Hola mundo`);
}
handler.command = /^(hola)$/i
export default handler`);
    } else {
        const fileName = text.split(' ')[0];
        const content = text.replace(`${fileName} `, '');

        try {
            fs.writeFileSync(`./plugins/${fileName}.js`, content);
            m.reply(`*[✅] EL PLUGIN "${fileName}" HA SIDO CREADO*`);
            } catch (error) {
                m.reply(`*[❌] ERROR AL CREAR EL PLUGIN "${fileName}"*\n\n*${error.message}*`);
            }
    }
};


handler.command = /^(addplugin|adp)$/i;
handler.rowner = true;

export default handler;
