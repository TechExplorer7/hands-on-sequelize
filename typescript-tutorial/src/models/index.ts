import { Sequelize } from 'sequelize'
import { initUserModel, User } from '../models/User'
import { initProjectModel, Project } from '../models/Project'

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
