
import message from "./message.js";
import WebSocket from "ws";

const config = (await import(`../src/config.js`)).default(process.env.NODE_ENV)

let correspondence_ = {
    'message': message
}
let correspondence = {};
for (const key of Object.keys(correspondence_)) {
  correspondence[key] = {
    data: (await import(`./${key}.js`)).default,
    socket: new WebSocket(`ws://127.0.0.1:${config.api.port}/${key}`)
  }
}
// TODO хорошо бы в функции добавить try и catch в особенности, вв случае взаимодействия с базой

const structure = (modelName) => ({
    get(id) {     
      if (typeof id === 'undefined' && id == null) {
        console.log('api/get');
        return correspondence[modelName].data;
      }
      let index = correspondence[modelName].data.findIndex(x => x.id == id);
      if (index > -1) {
        console.log(`api/get/${id}`);
        return correspondence[modelName].data[index]
      } else {
        console.log(`Not Found`);
        return `Not Found`
      }
    },  
    post({ ...record }) {
        const newItem = {id: correspondence[modelName].data.map(x => x.id).sort((a,b) => b - a)[0] + 1, ...record}
        correspondence[modelName].data = [...correspondence[modelName].data, newItem]
        correspondence[modelName].socket.send(`{"message": ${JSON.stringify(correspondence[modelName].data)}}`)
        return newItem;
    },
    //TODO update - put

    delete(id) {
        const index = correspondence[modelName].data.findIndex(x => x.id == id)        
        if (index > -1) {
            const item = correspondence[modelName].data[index]
            correspondence[modelName].data.splice(index, 1);
            correspondence[modelName].socket.send(`{"message": ${JSON.stringify(correspondence[modelName].data)}}`)
            return item;
        } else {
          return `Not Found`
        }
    },
  });

  export default structure;