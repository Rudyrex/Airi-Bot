import axios from 'axios';

const {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto
} = (await import("@whiskeysockets/baileys"))["default"];

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, "⚠️ Ingresa el texto de lo que quieres buscar en TikTok", m);
  }

  async function generateVideoMessage(url) {
    const { videoMessage } = await generateWAMessageContent(
      { 'video': { 'url': url } },
      { 'upload': conn.waUploadToServer }
    );
    return videoMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  try {
    let results = [];
    let { data } = await axios.get(`https://deliriussapi-oficial.vercel.app/search/tiktoksearch?query=${text}`);
    let videos = data.meta;
    shuffleArray(videos);
    let topVideos = videos.splice(0, 6);

    for (let video of topVideos) {
      results.push({
        'body': proto.Message.InteractiveMessage.Body.fromObject({ 'text': null }),
        'footer': proto.Message.InteractiveMessage.Footer.fromObject({ 'text': author }),
        'header': proto.Message.InteractiveMessage.Header.fromObject({
          'title': video.title,
          'hasMediaAttachment': true,
          'videoMessage': await generateVideoMessage(video.hd)
        }),
        'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ 'buttons': [] })
      });
    }

    const responseMessage = generateWAMessageFromContent(m.chat, {
      'viewOnceMessage': {
        'message': {
          'messageContextInfo': { 'deviceListMetadata': {}, 'deviceListMetadataVersion': 2 },
          'interactiveMessage': proto.Message.InteractiveMessage.fromObject({
            'body': proto.Message.InteractiveMessage.Body.create({ 'text': `*Resultado de:* ${text}` }),
            'footer': proto.Message.InteractiveMessage.Footer.create({ 'text': "TikTok - Search" }),
            'header': proto.Message.InteractiveMessage.Header.create({ 'hasMediaAttachment': false }),
            'carouselMessage': proto.Message.InteractiveMessage.CarouselMessage.fromObject({ 'cards': results })
          })
        }
      }
    }, { 'quoted': m });

    await conn.relayMessage(m.chat, responseMessage.message, { 'messageId': responseMessage.key.id });
  } catch (e) {
    console.log(e);
  }
};


handler.command = ["tiktoksearch", "tts", "tiktoks"];

export default handler;
