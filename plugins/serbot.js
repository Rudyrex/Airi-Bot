const {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion, 
    MessageRetryMap,
    makeCacheableSignalKeyStore, 
    jidNormalizedUser
} = await import('@whiskeysockets/baileys');
import moment from 'moment-timezone';
import NodeCache from 'node-cache';
import readline from 'readline';
import qrcode from "qrcode";
import crypto from 'crypto';
import fs from "fs";
import pino from 'pino';
import * as ws from 'ws';
const { CONNECTING } = ws;
import { Boom } from '@hapi/boom';
import { makeWASocket } from '../lib/simple.js';

if (!(global.conns instanceof Array)) global.conns = [];

// ✅ Lista personalizada de códigos para América y Europa
const COUNTRY_CODES = [
    '1',   // EE. UU. y Canadá
    '7',   // Rusia
    '20',  // Egipto
    '30',  // Grecia
    '31',  // Países Bajos
    '32',  // Bélgica
    '33',  // Francia
    '34',  // España
    '52',  // México
    '53',  // Cuba
    '54',  // Argentina
    '503', // El Salvador
    '598'  // Uruguay
];

// ✅ Función para limpiar, corregir y verificar el número
function sanitizePhoneNumber(number) {
    number = number.replace(/\s+/g, '').replace(/[^0-9+]/g, '');

    if (number.startsWith('+521')) number = number.replace('+521', '+52'); // Corrige prefijo mexicano

    // Verifica si el número tiene un código válido
    if (!COUNTRY_CODES.some(code => number.startsWith(code))) {
        throw new Error(`Número inválido o código de país no permitido: ${number}`);
    }
    return number;
}

let handler = async (m, { conn: _conn, args, usedPrefix, command }) => {
    let parent = args[0] === 'plz' ? _conn : await global.conn;
    if (!((args[0] === 'plz') || (await global.conn).user.jid === _conn.user.jid)) {
        return m.reply(`Este comando solo puede ser usado en el bot principal! wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`);
    }

    async function serbot() {
        let authFolderB = crypto.randomBytes(10).toString('hex').slice(0, 8);
        if (!fs.existsSync("./serbot/" + authFolderB)) {
            fs.mkdirSync("./serbot/" + authFolderB, { recursive: true });
        }
        args[0] ? fs.writeFileSync("./serbot/" + authFolderB + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : "";

        const { state, saveCreds } = await useMultiFileAuthState(`./serbot/${authFolderB}`);
        const msgRetryCounterCache = new NodeCache();
        const { version } = await fetchLatestBaileysVersion();
        let phoneNumber;

        try {
            phoneNumber = sanitizePhoneNumber(m.sender.split('@')[0]);
        } catch (error) {
            return m.reply(`❌ *Error:* ${error.message}`);
        }

        const methodCode = !!phoneNumber || process.argv.includes("code");
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

        const connectionOptions = {
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            mobile: process.argv.includes("mobile"),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            msgRetryCounterCache,
            defaultQueryTimeoutMs: undefined,
            version
        };

        let conn = makeWASocket(connectionOptions);

        if (methodCode && !conn.authState.creds.registered) {
            if (!phoneNumber) process.exit(0);

            setTimeout(async () => {
                let codeBot = await conn.requestPairingCode(phoneNumber);
                codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
                let txt = ` –  *S E R B O T  -  S U B B O T*\n\n`
                    + `┌  ✩  *Usa este Código para convertirte en un Sub Bot*\n`
                    + `│  ✩  *1* : Haga click en los 3 puntos\n`
                    + `│  ✩  *2* : Toque dispositivos vinculados\n`
                    + `│  ✩  *3* : Selecciona *Vincular con el número de teléfono*\n`
                    + `└  ✩  *4* : Escriba el Código\n\n`
                    + `*Nota:* Este Código solo funciona en el número que lo solicitó.`;
                await parent.reply(m.chat, txt, m);
                await parent.reply(m.chat, codeBot, m);
                rl.close();
            }, 3000);
        }

        conn.isInit = false;
        let isInit = true;

        async function connectionUpdate(update) {
            const { connection, isNewLogin } = update;
            if (isNewLogin) conn.isInit = true;
            if (connection === 'open') {
                conn.isInit = true;
                global.conns.push(conn);
                await parent.reply(m.chat, '✅ *Conectado exitosamente con WhatsApp*', m);
            }
        }

        conn.ev.on('connection.update', connectionUpdate);
    }
    serbot();
};

handler.command = ['codebot', 'code', 'subbot'];
export default handler;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
		    
