const BaseDb = require('./base/basePromiseDb')

class UserDb extends BaseDb {
  async getUsers (callback) {
    const sql = 'SELECT * FROM users'
    this.selectRecord(sql, (err, result) => {
      if (err) {
        return callback(true)
      }
      callback(false, result)
    })
  }

  initData (callback) {
    console.log('start...')
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        const asyncFunc = async (conn) => {
          // データクリア
          await conn.execute('DELETE FROM users')
          // await conn.execute('TRUNCATE TABLE users') // IDも初期化

          // 初期データ追加
          const values = [['太郎', 'taro'], ['花子', 'hanako'], ['一郎', 'ichiro'], ['次郎', 'jiro']]
          const sql = 'INSERT INTO users (name, account) VALUES ?'
          await conn.query(sql, [values])

          /*
          // 新規ユーザの情報を取得
          sql = 'SELECT * FROM _login_user WHERE lu_id = ? AND lu_deleted = false'
          const [rows3] = await conn.query(sql, [newId])
          if (rows3.length === 1) {
            return rows3[0]
          } else { // 例外を発生させてトランザクションをキャンセルし、エラーコードを返す
            throw new Error('ユーザ追加エラー: ユーザ情報数=' + rows3.length)
          } */
        }
        this.execAsyncFunctionWithTran(asyncFunc).then(([err, result]) => {
          // if (!err) log.info('データを追加しました。ユーザID=' + result.lu_id + ',アカウント=' + result.lu_account + ',ユーザ名=' + result.lu_name)
          if (callback) callback(err, result)
          if (err) {
            // return reject(new Error('error....'))
            return reject(err)
          } else {
            return resolve(result)
          }
        })
      })
    })
  }

  initData2 () {
    console.log('start...')

    const asyncFunc = async (conn) => {
      // データクリア
      await conn.execute('DELETE FROM users')
      // await conn.execute('TRUNCATE TABLE users') // IDも初期化

      // 初期データ追加
      const values = [['太郎', 'taro'], ['花子', 'hanako'], ['一郎', 'ichiro'], ['次郎', 'jiro']]
      const sql = 'INSERT INTO users (name, account) VALUES ?'
      await conn.query(sql, [values])
      console.log('-----end----')
    }
    return this.execAsyncFunctionWithTran(asyncFunc)
  }

  tranFail1 () {
    console.log('#tranFail1 start...')

    const asyncFunc = async (conn) => {
      // データクリア
      await conn.execute('DELETE FROM users')
      // await conn.execute('TRUNCATE TABLE users') // IDも初期化

      // 初期データ追加
      const values = [['太郎2', 'taro'], ['花子2', 'hanako'], ['一郎2', 'ichiro'], ['次郎2', 'jiro']]
      const sql = 'INSERT INTO users (name, account) VALUES ?'
      await conn.query(sql, [values])

      const values2 = [['太郎3', 'taro'], ['花子3', 'hanako'], ['一郎3', 'ichiro'], ['次郎3', 'jiro']]
      const sql2 = 'INSERT INTO users (name, account) VALUES ?'
      await conn.query(sql2, [values2])
      console.log('#tranFail1 -----end----')
    }
    return this.execAsyncFunctionWithTran(asyncFunc)
  }
}
module.exports = UserDb
