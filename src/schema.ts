import { sqliteTable, text, integer,blob } from "drizzle-orm/sqlite-core";

export const room = sqliteTable('room', {
  roomid: text('roomid').primaryKey(),
  name: text('name').notNull(),
  info: text('info').notNull(),
  tags: text('tags').$type<string[]>().notNull(),
})
export const nowroominfo = sqliteTable('nowroominfo', {
  roomid: text('roomid').primaryKey(),
  name: text('name').notNull(),
  tags: text('tags').$type<string[]>().notNull(),
  info: blob('info').notNull(),
})