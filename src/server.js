
import structure from "../data/structure.js";
import http from "../transport/http.js";
import ws from '../transport/ws.js'
const config = (await import(`../src/config.js`)).default(process.env.NODE_ENV)

const routing = {
    message: structure('message')
  };

  // Добавить обработку конфигов в заморозки

let server = http(routing, config.api.port)
let ws_sever = ws(server); 
