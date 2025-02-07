import fs from "fs";
import { catbox } from "../lib/catbox.js"; // Asegúrate de que esté en la misma carpeta

let handler = async (m) => {
  try {
    const q = m.quoted || m;
    const mime = q.mediaType || "";
    
    if (!/image|video|audio|sticker|document/.test(mime)) {
      m.reply(`${em} *Responde a una imagen, vídeo, audio o documento*`);
    }

    const media = await q.download(true);
    const fileSizeInBytes = fs.statSync(media).size;

    if (fileSizeInBytes === 0) {
      await m.reply(`${em} *El archivo es demasiado pequeño*`);
      await fs.promises.unlink(media);
      return;
    }

    if (fileSizeInBytes > 200 * 1024 * 1024) { // 200MB en bytes
      await m.reply(`${em} *El archivo supera 200MB*`);
      await fs.promises.unlink(media);
      return;
    }

    // Subir archivo a Catbox
    const { url } = await catbox(media);
    await fs.promises.unlink(media); // Eliminar archivo local después de subir

    await m.reply(`${em} *Aquí tienes la URL de tu archivo:*\n${url}`);
  } catch (e) {
    await m.reply(`${e}`);
  }
};

handler.command = ['upload'];

export default handler;
      
