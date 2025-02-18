import fetch from 'node-fetch';


export const apis = {
  delirius: 'https://delirius-apiofc.vercel.app/',
  siputzx: 'https://api.siputzx.my.id/api/',
  cloudseek: 'https://cloudseek-api.vercel.app/',
  ryzen: 'https://apidl.asepharyana.cloud/',
  rioo: 'https://restapi.apibotwa.biz.id/',
  random1: 'https://api.agungny.my.id/api/'
};

const iconUrls = [
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/icon1.jpg",
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/icon2.jpg",
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/icon3.jpg",
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/icon4.jpg",
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/icon5.jpg"
];

export const getRandomIcon = () => {
    const randomIcon = Math.floor(Math.random() * iconUrls.length);
    return iconUrls[randomIcon];
};

const thumbUrls = [
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/thumbnail1.jpg",
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/thumbnail2.jpg",
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/thumbnail3.jpg",
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/thumbnail4.jpg",
    "https://raw.githubusercontent.com/Rudyrex/Airi-Bot/refs/heads/main/src/img/thumbnail5.jpg"
];

async function loadThumbnail() {
    const response = await fetch(thumbUrls[0]);
    const buffer = await response.buffer();
    return buffer;
}

export const thumbnail = loadThumbnail();

export const getRandomThumb = () => {
    const randomThumb = Math.floor(Math.random() * thumbUrls.length);
    return thumbUrls[randomThumb];
};

console.log('exports.js cargado ✓');
