console.log('🤖 Iniciando...');

import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import express from 'express';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);

const app = express();
const port = process.env.PORT || 8080;

say('Airi-Bot', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta'],
});

let isRunning = false;

async function start(file) {
  if (isRunning) return;
  isRunning = true;

  const args = [join(__dirname, file), ...process.argv.slice(2)];
  setupMaster({ exec: args[0], args: args.slice(1) });

  let p = fork();

  p.on('message', (data) => {
    switch (data) {
      case 'reset':
        console.log('🔄 Reiniciando bot...');
        p.kill(); // Termina el proceso hijo
        isRunning = false;
        setTimeout(() => start(file), 1000); // Reinicia con retraso
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });

  p.on('exit', (_, code) => {
    isRunning = false;
    if (code !== 0) {
      console.error('Error inesperado:', code);
      watchFile(args[0], () => {
        unwatchFile(args[0]);
        start(file);
      });
    }
  });

  const opts = new Object(
    yargs(process.argv.slice(2)).exitProcess(false).parse()
  );

  if (!opts['test'] && !rl.listenerCount()) {
    rl.on('line', (line) => {
      p.emit('message', line.trim());
    });
  }
}

start('start.js'); // Archivo principal del bot
