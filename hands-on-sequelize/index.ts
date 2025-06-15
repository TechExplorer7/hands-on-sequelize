import { Sequelize, DataTypes } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || '',
  process.env.MYSQL_USER || '',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
  },
)

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  birthday: DataTypes.DATE,
})

async function main() {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

    await sequelize.sync({ force: true })

    await User.create({
      username: 'sequelize',
      birthday: new Date(1980, 6, 20),
    })

    const users = await User.findAll()
    console.log(users)
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
