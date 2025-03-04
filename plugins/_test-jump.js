let handler = async (m, { conn }) => {
    m.react('🐟');
}

// Detecta varias expresiones sin prefijo
handler.customPrefix = /^(Magikarp jump|Duelo|🐟)$/i;
handler.command = true;

export default handler;
