import axios from 'axios';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('${em} *Debes especificar un paquete de NPM.*');

    let packageName = args[0];
    let apiUrl = `https://registry.npmjs.org/${packageName}/latest`;

    try {
        let { data } = await axios.get(apiUrl);
        let tarballUrl = data.dist.tarball;

        await conn.sendMessage(m.chat, { 
            document: { url: tarballUrl }, 
            mimetype: 'application/gzip', 
            fileName: `${packageName}.tgz`
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        m.reply('${em} *Hubo un error al obtener el paquete. Asegúrate de que el nombre es correcto.*');
    }
};

handler.command = ['npmdl', 'dlnpm'];
export default handler;
