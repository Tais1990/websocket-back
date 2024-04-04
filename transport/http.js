
import http from 'node:http';

const HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=UTF-8',
};

const receiveArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};

const http_= (routing, port) => {
  let server = http.createServer(async (req, res) => {
    res.writeHead(200, HEADERS);
    const { url, socket, method } = req;
    const [dir, name, id] = url.substring(1).split('/');
    const entity = routing[name];
    if (!entity) return void res.end('Not found');
    const handler = entity[method.toLowerCase()];
    if (!handler) return void res.end('Not found');
    const src = handler.toString();
    const signature = src.substring(0, src.indexOf(')'));
    const args = [];
    if (signature.includes('(id')) args.push(id);
    if (signature.includes('{')) args.push(await receiveArgs(req));
    const result = await handler(...args);
    res.end(JSON.stringify(result));
  }).listen(port, () => {
    console.log(`API listen port ${port}`);
  });
  return server;
};

export default http_;