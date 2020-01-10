// ベースモジュール初期化
require('./base')

const UserDb = require('./userDb')

console.log('#DB接続開始')
const sampleDb = new UserDb('localhost', 'testdb', 'root', '')

sampleDb.getUserInfo('taro', (err, result) => {
  if (err) {
    console.log('取得エラー')
    return
  }
  // 取得データを表示
  console.log('ID=' + result[0].id)
  console.log('名前=' + result[0].name)
  console.log('#DB接続終了')

  // 正常終了
  process.exit(0)
})
