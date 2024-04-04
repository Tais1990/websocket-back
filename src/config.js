
const defaultConfig = {
  api: {
    port: 8000
  }
}

let conf = {
  dev: defaultConfig,
  prod: defaultConfig
}

export default (mode) => conf[mode];