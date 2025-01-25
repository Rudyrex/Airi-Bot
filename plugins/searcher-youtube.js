
import { apis } from '../exports.js';
import axios from 'axios';

const {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto
} = (await import("@whiskeysockets/baileys"))["default"];

let handler = async (message, { conn, text }) => {
  if (!text) {
    return message.reply("_*[ ⚠️ ] Ingresa lo que quieres buscar en YouTube*_");
  }

  async function createImageMessage(url) {
    const { imageMessage } = await generateWAMessageContent({
      'image': { 'url': url }
    }, { 'upload': conn.waUploadToServer });
    return imageMessage;
  }

  try {
    let imageMessages = [];
    let { data } = await axios.get(`${apis.delirius}search/ytsearch?q=${encodeURIComponent(text)}`);
    

    if (!data.data) {
      return message.reply("⚠️ No se encontraron resultados para la búsqueda");
    }

    let selectedResults = data.data.splice(0, 15);

    for (let result of selectedResults) {
      

      imageMessages.push({
        'body': proto.Message.InteractiveMessage.Body.fromObject({
          'text': `╭─${em}──✦\n│⥤📝 *Titulo:* ${result.title}\n│⥤👤 *Autor:* ${result.author.name}\n│⥤⏱️ *Duración:* ${result.duration}\n│⥤🌐 *Publicado:* ${result.publishedAt}\n│⥤👁️ *Vistas:* ${result.views}\n│⥤🔗 *Link:* ${result.url}\n╰─${em}──✦`
        }),
        'footer': proto.Message.InteractiveMessage.Footer.fromObject({
          'text': ""
        }),
        'header': proto.Message.InteractiveMessage.Header.fromObject({
          'title': "", 
          'hasMediaAttachment': true,
          'imageMessage': await createImageMessage(result.image)
        }),
        'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          
        })
      });
    }

    const finalMessage = generateWAMessageFromContent(message.chat, {
      'viewOnceMessage': {
        'message': {
          'messageContextInfo': {
            'deviceListMetadata': {},
            'deviceListMetadataVersion': 2
          },
          'interactiveMessage': proto.Message.InteractiveMessage.fromObject({
            'body': proto.Message.InteractiveMessage.Body.create({
              'text': "*Resultados de:* " + text
            }),
            'footer': proto.Message.InteractiveMessage.Footer.create({
              'text': ""
            }),
            'header': proto.Message.InteractiveMessage.Header.create({
              'hasMediaAttachment': false
            }),
            'carouselMessage': proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              'cards': [...imageMessages]
            })
          })
        }
      }
    }, { 'quoted': message });

    await conn.relayMessage(message.chat, finalMessage.message, { 'messageId': finalMessage.key.id });

  } catch (error) {
    console.error(error);
    message.reply("_*[ ❌ ] Hubo un error al buscar. Inténtalo de nuevo más tarde.*_");
  }
};


handler.command = ['ytsearch', 'yts'];

export default handler;
