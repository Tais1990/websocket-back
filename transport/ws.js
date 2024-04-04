import WebSocket, { WebSocketServer } from 'ws';

const ws_= (server) => {
  const ws = new WebSocketServer({ server });

  ws.on('connection', (connection, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`Connected ${ip}`);
    connection.on('message', (message) => {
      console.log('Received: ' + message);
      for (const client of ws.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;
        if (client === connection) continue;
        client.send(message, { binary: false });
      }
    });
    connection.on('close', () => {
      console.log(`Disconnected ${ip}`);
    });
  });
  console.log('WS is roll out');
  return ws_;
}

export default ws_;