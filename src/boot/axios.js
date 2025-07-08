import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://brasilapi.com.br/api'
})

export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
