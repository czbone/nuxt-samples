const BaseDb = require('./base/basePromiseDb')

class UserDb extends BaseDb {
  getUsers () {
    const sql = 'SELECT * FROM users'
    return this.execQuery(sql)
  }

  tranBlock () {
    console.log('start...')

    const asyncFunc = async (conn) => {
      // データクリア
      await conn.execute('DELETE FROM users')

      // 初期データ追加
      const values = [['taro', '太郎'], ['hanako', '花子'], ['jiro', '次郎']]
      const sql = 'INSERT INTO users (account, name) VALUES ?'
      await conn.query(sql, [values])
      console.log('-----end----')
    }
    return this.execAsyncFunctionWithTran(asyncFunc)
  }

  tranBlockToFail1 () {
    console.log('#tranFail1 start...')

    const asyncFunc = async (conn) => {
      // データクリア
      await conn.execute('DELETE FROM users')

      // 初期データ追加
      const values = [['taro', '太郎1'], ['hanako', '花子1'], ['jiro', '次郎1']]
      const sql = 'INSERT INTO users (account, name) VALUES ?'
      await conn.query(sql, [values])

      // キーを重複データでエラーを発生させる
      const values2 = [['taro', '太郎2'], ['hanako', '花子2'], ['jiro', '次郎2']]
      const sql2 = 'INSERT INTO users (account, name) VALUES ?'
      await conn.query(sql2, [values2])
      console.log('#tranFail1 -----end----')
    }
    return this.execAsyncFunctionWithTran(asyncFunc)
  }
}
module.exports = UserDb
