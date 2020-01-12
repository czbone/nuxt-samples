// ベースモジュール初期化
require('./base')
const UserDb = require('./userDb')
const userDb = new UserDb()

;(async () => {
  // await userDb.initData()
  const [err] = await userDb.initData2()
  if (err) throw new Error('error....')

  console.log(err)
  console.log('main...end....')

  const [err2] = await userDb.tranFail1()
  if (err2) throw new Error('error2....')
  console.log(err2)

  // 正常終了
  console.log('正常終了')
  process.exit(0)
})().catch((err) => { // reject()実行でこちらに来る
  console.log('エラー発生')
  console.error(err)

  // 異常終了
  console.log('異常終了')
  process.exit(1)
})
// console.log('#DB接続開始')

// const userDb = new UserDb()
/*
  await userDb.getUsers((err, result) => {
    if (err) {
      // console.log('取得エラー')

    }
    // 取得データを表示
    // console.log('ID=' + result[0].id + ', 名前=' + result[0].name)
    // console.log(result)
    // console.log('#DB接続終了')
  })
  console.log('#ユーザ取得終了')
  */
