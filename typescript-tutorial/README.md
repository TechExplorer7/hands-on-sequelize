# TypeScript チュートリアル

[Sequelize公式ドキュメント](https://sequelize.org/docs/v6/other-topics/typescript/)

## モデルの定義方法

### 古い方法(冗長)

```ts
type UserAttributes = {
  id: number
  name: string
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number
  declare name: string
}
```

### 新しい方法(推奨：Sequelize v6.14.0〜)

```ts
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare name: string
}
```

## 特殊なユーティリティ型

### `CreationOptional<T>`

作成時に省略できる属性（例：autoIncrement な ID、createdAt など）に使う

```ts
// declare id: CreationOptional<number>;
// declare createdAt: CreationOptional<Date>;
```

### `NonAttribute<T>`

モデルの 属性ではない もの（例：関連モデル、getter など）に使うことで InferAttributes の対象から外せる

```ts
declare projects?: NonAttribute<Project[]>;
get fullName(): NonAttribute<string> { return this.name; }
```

### `ForeignKey<T>`

関連モデルのIDに使うと、Model.init でエラーにならないようにできる（belongsTo や hasMany の設定と連携）

```ts
// declare ownerId: ForeignKey<User['id']>;
```

## 関連 (Association) の記述

Sequelize では関連をクラスに明示的に declare する必要があります。

※実際の関連設定は User.hasMany(...) などで行いますが、型補完を効かせるために事前宣言しておくと良いです。

```ts
declare getProjects: HasManyGetAssociationsMixin<Project>;
declare addProject: HasManyAddAssociationMixin<Project, number>;
// ...
declare static associations: {
  projects: Association<User, Project>;
};
```

## Model.init() の使い方

各モデルは .init() メソッドで DB カラムとマッピングします。通常の Sequelize と同様の書き方ですが、TypeScript ではクラスと分けて考えます。

```ts
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
  },
  {
    sequelize,
    tableName: 'users',
  },
)
```

関数スタイルでモデル定義することもでき、簡易なユースケースでは便利です。

```ts
const Note: ModelDefined<NoteAttributes, NoteCreationAttributes> = sequelize.define('Note', {
  ...
});
```

## 型安全なモデル操作例

```ts
const newUser = await User.create({ name: 'Johnny' })
const project = await newUser.createProject({ name: 'first!' })

const ourUser = await User.findByPk(1, {
  include: [User.associations.projects],
  rejectOnEmpty: true,
})

console.log(ourUser.projects![0].name)
```
