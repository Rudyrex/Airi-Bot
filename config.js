import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 



global.owner = [
  ['50375961083', 'Rudy', true],
  ['522431268546'],
  ['584123989549']
]



global.mods = []
global.prems = []
   


global.packname = `Creado por`
global.author = '✿ 𝐀𝐢𝐫𝐢 ✿'
global.botname = '✿ 𝐀𝐢𝐫𝐢 ✿'
global.botdesc = `𝙱𝚘𝚝 𝚍𝚎 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 ✅`
global.baileys = '@whiskeysockets/baileys'

global.em = '🌱'

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment	

global.multiplier = 50 
global.maxwarn = '2'



let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
