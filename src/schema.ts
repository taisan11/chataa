import { sqliteTable, text, integer,blob } from "drizzle-orm/sqlite-core";
import { user } from "./types";

export const room = sqliteTable('room', {
  roomid: text('roomid').primaryKey(),
  name: text('name').notNull(),
  info: text('info').notNull(),
  tags: text('tags').$type<string[]>().notNull(),
})
export const nowroominfo = sqliteTable('nowroominfo', {
  roomid: text('roomid').primaryKey(),
  users: text('users').$type<user[]>().notNull(),
  peoples: integer('peoples').notNull(),
  rommers: integer('rommers').notNull(),
})
export const massage = sqliteTable('massage', {
  massageid: text('massageid').primaryKey(),
  roomid: text('roomid').notNull(),
  userid: text('userid').notNull(),
  text: text('text').notNull(),
  time: integer('time').notNull(),
  type: text('type').notNull(),
})