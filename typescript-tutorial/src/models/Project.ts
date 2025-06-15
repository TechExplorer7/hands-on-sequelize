import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  Sequelize,
} from 'sequelize'
import { BaseModel } from './BaseModel'
import { User } from './User'

export class Project extends BaseModel<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare name: string
  declare ownerId: ForeignKey<User['id']>
}

export function initProjectModel(sequelize: Sequelize) {
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'projects',
    },
  )
}
