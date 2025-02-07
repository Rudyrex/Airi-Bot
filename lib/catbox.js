import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function catbox(path) {
    try {
        const data = new FormData();
        data.append('reqtype', 'fileupload');
        data.append('userhash', '');
        data.append('fileToUpload', fs.createReadStream(path));

        const config = {
            method: 'POST',
            url: 'https://catbox.moe/user/api.php',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                'Accept': 'application/json',
                'accept-language': 'id-ID',
                'referer': 'https://catbox.moe/',
                'cache-control': 'no-cache',
                'x-requested-with': 'XMLHttpRequest',
                'origin': 'https://catbox.moe',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'te': 'trailers',
                ...data.getHeaders()
            },
            data: data
        };

        const response = await axios.request(config);
        return { url: response.data };
    } catch (error) {
        throw new Error(`Error al subir el archivo: ${error.message}`);
    }
}

export { catbox };
