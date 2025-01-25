import axios from 'axios';

const {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto
} = (await import("@whiskeysockets/baileys"))["default"];

let handler = async (message, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return message.reply("_*[ ⚠️ ] Ingresa el texto de lo que quieres buscar en imágenes de Google*_");
  }

  async function createImageMessage(url) {
    const { imageMessage } = await generateWAMessageContent({
      'image': { 'url': url }
    }, { 'upload': conn.waUploadToServer });
    return imageMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let imageMessages = [];
  try {
    let { data } = await axios.get(`https://api-airi.vercel.app/google-images?query=${encodeURIComponent(text)}`);
    if (data.status && data.results.length > 0) {
      let imageUrls = data.results.map(result => result.url);
      shuffleArray(imageUrls);
      let selectedImages = imageUrls.splice(0, 10);
      let count = 1;

      for (let imageUrl of selectedImages) {
        imageMessages.push({
          'body': proto.Message.InteractiveMessage.Body.fromObject({
            'text': ""
          }),
          'footer': proto.Message.InteractiveMessage.Footer.fromObject({
            'text': ""
          }),
          'header': proto.Message.InteractiveMessage.Header.fromObject({
            'title': '',
            'hasMediaAttachment': true,
            'imageMessage': await createImageMessage(imageUrl)
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
                'text': "*Resultado de:* " + text
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
    } else {
      message.reply("_*[ ⚠️ ] No se encontraron imágenes para esta búsqueda*_");
    }
  } catch (error) {
    message.reply("_*[ ⚠️ ] Error al buscar imágenes. Inténtalo de nuevo más tarde*_");
    message.reply(error.message);
    console.error(error);
  }
};

handler.command = ['goimg', 'googleimg'];

export default handler;
