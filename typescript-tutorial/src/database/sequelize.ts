import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'

export function initDb() {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') })
  const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || '',
    process.env.MYSQL_USER || '',
    process.env.MYSQL_PASSWORD || '',
    {
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
    },
  )

  return sequelize
}
