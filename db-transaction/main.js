// ベースモジュール初期化
require('./base')
const UserDb = require('./userDb')
const userDb = new UserDb()

;(async () => {
  console.log('#トランザクションブロック1を実行')
  const [err] = await userDb.tranBlock1()
  if (err) throw new Error('トランザクションブロック1でエラー発生')

  console.log('#DBの内容を表示')
  const [err2, result2] = await userDb.getUsers()
  console.log(result2)

  console.log('#トランザクションブロック2を実行')
  const [err3] = await userDb.tranBlock2ToFail()
  if (err3) {
    console.log('#DBの内容を表示')
    const [err4, result4] = await userDb.getUsers()
    console.log(result4)

    throw new Error('トランザクションブロック2でエラー発生')
  }

  // 正常終了(ここには来ない)
  console.log('#正常終了')
  process.exit(0)
})().catch((err) => { // reject()実行でこちらに来る
  console.error(err)

  // 異常終了(こちらで終了)
  console.log('#異常終了')
  process.exit(1)
})
