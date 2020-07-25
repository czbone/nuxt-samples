// ベースモジュール初期化
require('./base')
const UserDb = require('./userDb')
const userDb = new UserDb()

;(async () => {
  // ### 正常終了パターン(初期データ登録) ###
  console.log('#トランザクションブロック1を実行')
  const [err, code] = await userDb.tranBlock1()
  if (err) {
    console.log('=>エラーが発生しました。トランザクションはキャンセルされました。エラーコード=' + err)
    // throw new Error('トランザクションブロック1でエラー発生') // 異常終了で終わる場合は例外を投げる
  }

  console.log('=>ブロックの終了値=' + code)

  // テーブルの内容を表示
  await userDb.outputTable()

  // ### エラー発生パターン(値が重複するレコード登録してエラーを発生させる) ###
  console.log('#トランザクションブロック2を実行')
  const [err2] = await userDb.tranBlock2ToFail()
  if (err2) console.log('=>エラーが発生しました。トランザクションはキャンセルされました。エラーコード=' + err2)

  // テーブルの内容を表示
  await userDb.outputTable()

  // ### 正常パターン(登録データの一部を更新) ###
  console.log('#トランザクションブロック3を実行')
  const [err3] = await userDb.tranBlock3()
  if (err3) console.log('=>エラーが発生しました。トランザクションはキャンセルされました。エラーコード=' + err3)

  // テーブルの内容を表示
  await userDb.outputTable()

  // ### エラー発生パターン(内部で例外を発生させる) ###
  console.log('#トランザクションブロック4を実行')
  const [err4] = await userDb.tranBlock4ToFail()
  if (err4) console.log('=>エラーが発生しました。トランザクションはキャンセルされました。エラーコード=' + err4)

  // テーブルの内容を表示
  await userDb.outputTable()

  // 正常終了
  console.log('#正常終了')
  process.exit(0)
})().catch((err) => { // 例外を発生させるとこちらに来る
  console.error(err)

  // 異常終了
  console.log('#異常終了')
  process.exit(1)
})
