let handler = async (m, { conn, usedPrefix, isOwner }) => {
    let vcard = `BEGIN:VCARD
VERSION:3.0
N:Rudy;;;;
FN:Rudy:)
TITLE:
TEL;TYPE=CELL;waid=50375961083:+50375961083
END:VCARD`;

    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: 'Rudy:)', 
            contacts: [{ vcard }] 
        }
    }, { quoted: m });
}

handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
