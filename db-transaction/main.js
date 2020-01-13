// ベースモジュール初期化
require('./base')
const UserDb = require('./userDb')
const userDb = new UserDb()

;(async () => {
  const [err] = await userDb.tranBlock()
  if (err) throw new Error('トランザクションブロック1でエラー発生')

  const [err3, result3] = await userDb.getUsers()
  console.log(result3)
  console.log('main...end....')

  const [err2] = await userDb.tranBlockToFail1()
  if (err2) throw new Error('トランザクションブロック2でエラー発生')
  console.log(err2)

  // 正常終了
  console.log('#正常終了')
  process.exit(0)
})().catch((err) => { // reject()実行でこちらに来る
  console.error(err)

  // 異常終了
  console.log('#異常終了')
  process.exit(1)
})
