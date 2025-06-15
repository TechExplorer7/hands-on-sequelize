import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from 'sequelize'
import { BaseModel } from './BaseModel'

export class User extends BaseModel<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare name: string
  declare preferredName: string | null
}

export function initUserModel(sequelize: Sequelize) {
  User.init(
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
      preferredName: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'users',
    },
  )
}
