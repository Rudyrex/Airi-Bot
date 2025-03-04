let handler = async (m, { conn }) => {
    m.reply(`🐟`);
}

// Detecta varias expresiones sin prefijo
handler.customPrefix = /^(Magikarp jump|Duelo|🐟)$/i;
handler.command = true;

export default handler;
