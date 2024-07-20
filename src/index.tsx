import { Hono } from 'hono'
import { requestId,type RequestIdVariables } from 'hono/request-id'
import { getConnInfo } from 'hono/bun'
import {  } from 'hono/bun'
import type { ConnInfo } from 'hono/conninfo'
import type { SocketAddress } from 'bun'
import { db } from './db'
import { massage, nowroominfo, room } from './schema'
import { nanoid } from 'nanoid'
import { type room as roomtype } from './types'
import { eq } from 'drizzle-orm'
import {streamSSE} from 'hono/streaming'

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

app.post('/createRoom', async (c) => {
  const body:roomtype = await c.req.json()
  await db.insert(room).values({
    roomid: nanoid(),
    name: body.name,
    info: body.info,
    maxpeoples: body.maxpeoples,
    roomlistvisible: body.roomlistvisible,
    kakologvisible: body.kakologvisible,
    adminpassword: body.adminpassword,
    adminemail: body.adminemail,
    aikotoba: body.aikotoba,
    aikotobahinto: body.aikotobahinto,
    tags: body.tags
  })
  await db.insert(nowroominfo).values({
    roomid: body.roomid,
    users: [],
    peoples: 0,
    rommers: 0
  })
  return c.json({message:'ok'})
})

app.get('/getRooms', async (c) => {
  const noUser = Boolean(c.req.queries('noUser')?.[0])||false
  const limit = Number(c.req.queries('limit')?.[0]) || 10
  const offset_base = Number(c.req.queries('page')?.[0]) || 0
  const offset = offset_base * limit
  const rooms = await db.select().from(room).limit(limit).offset(offset)
  return c.json(rooms)
})

app.get('/getRoomInfo', async (c) => {
  const roomid = String(c.req.queries('roomid')?.[0]);
  if (!roomid) {
    return c.json({message:'roomid is required'});
  }
  const roominfo = await db.select().from(room).where(eq(room.roomid,roomid))
  return c.json(roominfo[0])
})

app.get('/getRoomReal', async (c) => {
  const roomid = String(c.req.queries('roomid')?.[0]);
  if (!roomid) {
    return c.json({message:'roomid is required'});
  }
  const roominfo = await db.select().from(nowroominfo).where(eq(nowroominfo.roomid,roomid))
  return c.json(roominfo[0])
})

app.post('/chat/post', async (c) => {
  const body = await c.req.json()
  await db.insert(massage).values({
    massageid: nanoid(),
    roomid: body.roomid,
    userid: body.userid,
    text: body.text,
    time: body.time,
    type: body.type
  })
  return c.json({message:'ok'})
})

app.get('/chat/realtime', async (c) => {
  const roomid = String(c.req.queries('roomid')?.[0]);
  if (!roomid) {
    return c.json({message:'roomid is required'});
  }
  const roominfo = await db.select().from(nowroominfo).where(eq(nowroominfo.roomid,roomid))
  return streamSSE(c,async (s)=>{
    while (true) {
      const message = `It is ${new Date().toISOString()}`
      await s.writeSSE({
        data: message,
        event: 'time-update',
        id: String(id++),
      })
      await s.sleep(1000)
    }
  })
})

app.get('/chat/kakolog', async (c) => {
  const roomid = String(c.req.queries('roomid')?.[0]);
  if (!roomid) {
    return c.json({message:'roomid is required'});
  }
  const roominfo = await db.select().from(room).where(eq(room.roomid,roomid))
  if (!roominfo[0].kakologvisible) {
    return c.json({message:'kakolog is not visible'})
  }
  return c.json({message:'ok'})
})

const server = Bun.serve({
  port:'8000',
  fetch(req,server) {
      return app.fetch(req,{server})
  }
})
console.log(`server start at ${server.url}`)