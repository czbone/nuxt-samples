

const SampleDb = require('sampleDb')

console.log('#DB接続開始')
const sampleDb = new SampleDb('192.168.1.46', 'testdb', 'root', '')

sampleDb.getUserInfo('admin', (err, result) => {
  if (err) {
    console.log('取得エラー')
    return
  }
  // 取得データを表示
  console.log('ID=' + result[0].lu_id)
  console.log('名前=' + result[0].lu_name)

  // ##### 一度DBに接続するとつながったままになるので終了させる #####
  sampleDb.close()
  console.log('#DB接続終了')
})
