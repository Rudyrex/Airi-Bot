
import fetch from 'node-fetch';
import { format } from 'util';

const handler = async (m, { text }) => {
  // Validar que el texto proporcionado sea una URL válida
  if (!/^https?:\/\//.test(text)) throw 'La URL debe ser http o https';

  let _url;
  try {
    _url = new URL(text); // Construir un objeto URL para validación
  } catch (e) {
    throw 'URL mal formada: ' + e.message;
  }

  // Realizar la solicitud HTTP
  const res = await fetch(_url.toString());

  if (!res.ok) throw `Error en la solicitud: ${res.status} ${res.statusText}`;

  // Validar el tamaño del contenido (si es mayor a 100 MB, rechazar)
  const contentLength = res.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 100 * 1024 * 1024) {
    throw `Content-Length excede el límite permitido: ${contentLength}`;
  }

  const contentType = res.headers.get('content-type');
  
  // Si el contenido no es texto o JSON, asume que es un archivo y lo envía
  if (!/text|json/.test(contentType)) {
    return conn.sendFile(m.chat, _url.toString(), 'file', text, m);
  }

  // Si el contenido es texto o JSON, procesarlo y enviarlo
  let txt;
  try {
    if (/application\/json/.test(contentType)) {
      // Si el contenido es JSON, intentar parsearlo
      const json = await res.json();
      txt = format(json);
    } else {
      // Si el contenido no es JSON, leerlo como texto
      txt = await res.text();
    }
  } catch (e) {
    txt = `Error procesando la respuesta: ${e.message}`;
  } finally {
    m.reply(txt.slice(0, 65536)); // Enviar el texto, limitado a 65,536 caracteres
  }
};

handler.command = /^(fetch|get)$/i;

export default handler;



/*
import fetch from 'node-fetch';
import { format } from 'util';

const handler = async (m, { text }) => {
  // Validar que la URL sea válida
  if (!/^https?:\/\//.test(text)) throw 'La URL debe ser http o https';

  let _url;
  try {
    _url = new URL(text);
  } catch (e) {
    throw 'URL mal formada: ' + e.message;
  }

  const res = await fetch(_url.toString());

  if (!res.ok) throw `Error en la solicitud: ${res.status} ${res.statusText}`;

  const contentLength = res.headers.get('content-length');
  if (contentLength && contentLength > 100 * 1024 * 1024) {
    throw `Content-Length: ${contentLength}`;
  }

  const contentType = res.headers.get('content-type');
  if (!/text|json/.test(contentType)) {
    // Si no es texto o JSON, envía el archivo como está
    return conn.sendFile(m.chat, _url.toString(), 'file', text, m);
  }

  let txt;
  try {
    const buffer = await res.buffer();
    txt = format(JSON.parse(buffer.toString()));
  } catch (e) {
    txt = `Error procesando la respuesta: ${e.message}`;
  } finally {
    m.reply(txt.slice(0, 65536));
  }
};

handler.command = /^(fetch|get)$/i;

export default handler;
*/
