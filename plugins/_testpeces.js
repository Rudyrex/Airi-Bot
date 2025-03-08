let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    if (!user.peces || user.peces.length === 0) {
        return m.reply("❌ *No tienes ningún Magikarp en tu colección.* 🎣");
    }

    let mensaje = "🎏 *Tus Magikarps:* 🎏\n\n";

    user.peces.forEach((magikarp, index) => {
        mensaje += `🐟 *${index + 1}.* ${magikarp.nombre}  
        📈 *Nivel:* ${magikarp.nivel}  
        ⚡ *KP:* ${magikarp.kp}\n\n`;
    });

    m.reply(mensaje);
};

handler.command = /^(mispeces)$/i;

export default handler;
