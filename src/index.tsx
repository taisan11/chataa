import { Hono } from 'hono'
import { requestId,type RequestIdVariables } from 'hono/request-id'
import { getConnInfo } from 'hono/bun'
import {  } from 'hono/bun'
import type { ConnInfo } from 'hono/conninfo'
import type { SocketAddress } from 'bun'

const app = new Hono<{
  Variables: RequestIdVariables&{info:ConnInfo},
  Bindings: {
    ip: SocketAddress
    cmd:{
      stop:void
    }
}
}>()



app.use('*', requestId())
app.use('*',async(c,next)=>{
  const info = getConnInfo(c)
  c.set('info',info)
  await next()
})

app.get('/', (c) => {
  return c.json({reqid:c.get('requestId'),info:c.get('info')})
})

const server = Bun.serve({
  port:'8000',
  fetch(req,server) {
      return app.fetch(req,{server})
  }
})
console.log(`server start at ${server.url}`)