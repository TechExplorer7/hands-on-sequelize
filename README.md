# Sequelize × TypeScript × Docker ハンズオン

TypeScript 環境で Sequelize を使って MySQL に接続し、簡単なモデルを定義して CRUD 操作を行うまでを Docker 環境で試します。

## TypeScript 環境構築

Node.js のプロジェクトを初期化します。

```sh
npm init -y
```

TypeScript をインストールします。

```sh
npm i -D typescript @types/node ts-node-dev
```

TypeScript プロジェクトの初期設定ファイル (`tsconfig.json`) を作成します。

```sh
npx tsc --init
```

## ESLint / Prettier 導入

ESLint をインストールします。

```sh
npm install --save-dev eslint
```

下記のコマンドで、対話的に ESLint 構成を作成します。

```sh
npx eslint --init
```

Prettier をインストールします。

```sh
npm install --save-dev prettier eslint-config-prettier
```

.eslintrc.js に Prettier の設定を追加します。

```js
module.exports = {
  /* 中略 */
  extends: [
    /* 中略 */
    'prettier', // 追加。他の設定の上書きを行うために、必ず最後に配置する。
  ],
}
```

.prettierrc に自動整形の設定を追加します。

```json
{
  "semi": false,
  "singleQuote": true
}
```

## Sequelize のセットアップ

Sequelize をインストールします。

```sh
npm install sequelize mysql2 dotenv
```

src/index.ts でモデルを定義します。

```ts
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
```

## Docker で MySQL コンテナを準備

MySQL のコンテナを作成し、接続できるようにするために、プロジェクトのルートに docker-compose.yaml を作成します。

```yaml
services:
  backend:
    container_name: backend
    image: node:22
    working_dir: /app
    tty: true
    depends_on:
      - db
    ports:
      - 8000:8000
    volumes:
      - .:/app
    networks:
      - backend

  db:
    container_name: db
    image: mysql:8
    restart: always
    ports:
      - 3306:3306
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_HOST=${MYSQL_HOST}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
    volumes:
      - ./db/conf.d:/etc/mysql/conf.d
      - ./db/data:/var/lib/mysql
    networks:
      - backend

networks:
  backend:
```

環境変数は `.env` から読み込まれるため、プロジェクトのルートに `.env` ファイルを作成します。

```ini
MYSQL_ROOT_PASSWORD=password
MYSQL_HOST=db
MYSQL_USER=test
MYSQL_PASSWORD=password
MYSQL_DATABASE=test_database
```

MySQLの設定ファイル `my.cnf` を作成します。

```ini:my.cnf
[mysqld]
default-time-zone = 'Asia/Tokyo'
character-set-server = utf8mb4
collation-server = utf8mb4_bin

[client]
default-character-set = utf8mb4
```

Docker コンテナを起動します。

```sh
docker compose up -d
```

backend コンテナに入るには、以下のコマンドを実行します。

```sh
docker compose exec backend /bin/bash
```

## 動作確認

`package.json` に実行用の `scripts` を追加します。

```json
  "scripts": {
    "dev": "ts-node-dev --respawn --pretty --transpile-only src/index.ts"
  },
```

以下のコマンドでアプリを起動します。

```sh
npm run dev
```

DBに接続して確認するには `default-mysql-client` を使用します。

```sh
apt-get update
apt-get install -y default-mysql-client
mysql -h db -u test -ppassword test_database
```

```sh
MySQL [test_database]> show tables;
+-------------------------+
| Tables_in_test_database |
+-------------------------+
| Users                   |
+-------------------------+
1 row in set (0.001 sec)

MySQL [test_database]> describe Users;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| id        | int          | NO   | PRI | NULL    | auto_increment |
| username  | varchar(255) | YES  |     | NULL    |                |
| birthday  | datetime     | YES  |     | NULL    |                |
| createdAt | datetime     | NO   |     | NULL    |                |
| updatedAt | datetime     | NO   |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
5 rows in set (0.002 sec)

MySQL [test_database]> select * from Users;
+----+-----------+---------------------+---------------------+---------------------+
| id | username  | birthday            | createdAt           | updatedAt           |
+----+-----------+---------------------+---------------------+---------------------+
|  1 | sequelize | 1980-07-20 00:00:00 | 2025-06-08 07:21:02 | 2025-06-08 07:21:02 |
+----+-----------+---------------------+---------------------+---------------------+
1 row in set (0.001 sec)
```
