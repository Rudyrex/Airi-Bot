
import Starlights from '@StarlightsTeam/Scraper';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    let args = m.text.split(' ').slice(1);
    try {
        let { title, size, quality, thumbnail, dl_url } = await Starlights.ytmp4(args[0]);
        await m.reply(dl_url);
    } catch (error) {
        await m.reply(`¡Uy! Parece que hubo un error: ${error}`);
    }
}

handler.command = ['test90'];
export default handler;
