
let handler = async (m, { conn, command }) => {

if (command === 't1'){
        conn.reply(m.chat, 'prueba1', m, {
    contextInfo: {
        externalAdReply: {
            mediaUrl: null,
            mediaType: 1,
            description: null,
            title: 'Hhyrfcjjtgg',
            body: 'iyrrgbbfrtvv',
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: 'https://qu.ax/XvtPr.jpg',
            sourceUrl: 'https://qu.ax/XvtPr.jpg'
        }
    }
    });
} 
//--------------------------------
if (command === 't2') {
conn.reply(m.chat, 'prueba2', m, {
    contextInfo: {
        externalAdReply: {
            mediaUrl: null,
            mediaType: 1,
            description: null,
            title: '47756875555',
            body: '875567754566',
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: 'https://qu.ax/XvtPr.jpg',
            sourceUrl: 'https://qu.ax/XvtPr.jpg'
        }
    }
    });
}
//--------------------------------
if (command === 't3') {
conn.reply(m.chat, 'prueba3', m, {
    contextInfo: {
        externalAdReply: {
            mediaUrl: null,
            mediaType: 1,
            description: null,
            title: '34fddzxvhg66',
            body: '554ytecbbhgc',
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: 'https://qu.ax/MPeCD.jpg',
            sourceUrl: 'https://qu.ax/MPeCD.jpg'
        }
    }
    });
}
//--------------------------------
}
handler.command = ['t1', 't2', 't3'];
export default handler
