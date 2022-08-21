import { App } from 'flash-wolves'
import controllers from './controllers'
import beforeRunRoute from './interceptor/beforeRunRoute'

const app = new App({
  beforeRunRoute
})

app.addController(controllers)

app.listen(+process.env.SERVER_PORT)
