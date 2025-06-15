import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'
import { initUserModel, User } from './models/User'
import { initProjectModel, Project } from './models/Project'

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

export function initModels(sequelize: Sequelize) {
  initUserModel(sequelize)
  initProjectModel(sequelize)

  // Associations
  User.hasMany(Project, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'projects',
  })
  Project.belongsTo(User, { targetKey: 'id', foreignKey: 'ownerId' })
}
