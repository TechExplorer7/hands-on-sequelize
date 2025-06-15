import { initDb, initModels } from './db'
import { User } from './models/User'
import { BaseRepository } from './repositories/BaseRepository'

const main = async () => {
  const sequelize = initDb()
  initModels(sequelize)

  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')

    await sequelize.sync({ force: true })
    console.log('All models were synchronized successfully.')

    new BaseRepository(User).create({
      name: 'John Doe',
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
