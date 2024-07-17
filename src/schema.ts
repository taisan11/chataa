import { sqliteTable, text, integer,blob } from "drizzle-orm/sqlite-core";

export const user = sqliteTable('user', {
  // 固定情報
  id: text('id').primaryKey(),//UUID
  NyuuGaku: integer('NyuuGakunen').notNull(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  // 変動情報
  ViewID: text('ViewID').unique().notNull(),//表示ID
  NickName: text('NickName').notNull(),//ニックネーム
  Password: text('Password').notNull(),//パスワード(SHA256済み)
})
export const tempuser = sqliteTable('tempuser', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  password: text('password').notNull(),// パスワード(SHA256済み)
  timelimit: integer('timelimit').notNull(),
})