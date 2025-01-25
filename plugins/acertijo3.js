import fs from 'fs';
import similarity from 'similarity';
const threshold = 0.72;

let acertijos = JSON.parse(fs.readFileSync('./storage/acertijo.json', 'utf-8'));
let tekateki = {}; // Almacena los acertijos activos por chat

// Comando para enviar un acertijo
let handler = async (m, { conn }) => {
    let acertijo = acertijos[Math.floor(Math.random() * acertijos.length)];
    
    // Inicia un nuevo acertijo para el chat
    let mensajeEnviado = await m.reply(`Aquí tienes un acertijo:\n\n${acertijo.question}`);
    tekateki[m.chat] = {
        id: mensajeEnviado.id,  // Almacena el ID del mensaje de acertijo
        question: acertijo.question,
        response: acertijo.response,
        points: 10, // Cambia los puntos si prefieres
        timer: setTimeout(() => {
            conn.sendMessage(
                m.chat, 
                { text: `⏳ Tiempo agotado! El acertijo ha sido cancelado. La respuesta correcta era: *${acertijo.response}*` }
            );
            delete tekateki[m.chat];
        }, 60000) // Tiempo límite de 1 minuto (60000 ms)
    };
};

handler.command = ['acertijo3'];

// Verificación de respuesta
handler.before = async function(m) {
    const id = m.chat;

    // Verifica si el mensaje es de un usuario (no del bot)
    if (m.fromMe) return;

    // Verifica que haya un acertijo activo y que el mensaje citado sea el acertijo enviado por el bot
    if (
        tekateki[id] &&
        m.quoted && 
        m.quoted.fromMe && // Asegura que el mensaje citado sea del bot
        m.quoted.id === tekateki[id].id // Compara con el ID almacenado del mensaje de acertijo
    ) {
        const respuestaUsuario = m.text.toLowerCase().trim();
        const respuestaCorrecta = tekateki[id].response.toLowerCase().trim();

        // Verifica si la respuesta es exacta
        if (respuestaUsuario === respuestaCorrecta) {
            global.db.data.users[m.sender].estrellas += tekateki[id].points;
            m.reply(`🌟 *Respuesta correcta!*\n+${tekateki[id].points} puntos`);
            clearTimeout(tekateki[id].timer); // Limpia el temporizador
            delete tekateki[id]; // Elimina el acertijo
        } 
        // Verifica si la respuesta es "casi correcta" usando el umbral de similitud
        else if (similarity(respuestaUsuario, respuestaCorrecta) >= threshold) {
            m.reply('Casi lo logras!');
        } else {
            m.reply('Respuesta incorrecta!');
        }
    } 
    // Si no hay acertijo activo pero el mensaje es una respuesta a un mensaje de acertijo terminado
    else if (m.quoted && tekateki[id] === undefined && m.quoted.fromMe && m.quoted.id in Object.values(tekateki).map(t => t.id)) {
        m.reply('✨ Ese acertijo ya ha terminado!');
    }
};

export default handler;
                   
