import { Model, CreationOptional } from 'sequelize'

/**
 * 共通のベースモデルクラス。
 * 全てのモデルが継承すべきクラス。
 */
export class BaseModel<
  TModelAttributes extends object,
  TCreationAttributes extends object = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  // 自動的に追加されるフィールド
  declare id: CreationOptional<number>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}
