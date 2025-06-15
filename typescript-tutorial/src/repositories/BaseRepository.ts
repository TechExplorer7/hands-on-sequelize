import { CreationAttributes, Model, ModelStatic } from 'sequelize'

export class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>

  constructor(model: ModelStatic<T>) {
    this.model = model
  }

  async create(entity: CreationAttributes<T>): Promise<T> {
    return this.model.create(entity)
  }
}
