const app = require('./app')
const env = require('./config/env')

app.listen(env.PORT, () => {
  console.log(`POS Backend running on port ${env.PORT}`)
})