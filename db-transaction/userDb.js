const BaseDb = require('./base/basePromiseDb')

class UserDb extends BaseDb {
  /**
   * テーブルの内容をデバッグコンソールに出力
   */
  async outputTable () {
    console.log('#テーブルの内容を表示')
    const sql = 'SELECT * FROM users'
    const [err, result] = await this.execQuery(sql)
    console.log(result)
  }

  /**
   * トランザクション1(正常パターン)
   *
   * テーブルをクリアし、初期レコードを登録。
   */
  tranBlock1 () {
    const asyncFunc = async (conn) => {
      console.log('#トランザクションブロック1 - 開始')

      // テーブルクリア
      await conn.execute('DELETE FROM users')

      // 初期データ追加
      const values = [['taro', '太郎'], ['hanako', '花子'], ['jiro', '次郎']]
      const sql = 'INSERT INTO users (account, name) VALUES ?'
      await conn.query(sql, [values])

      console.log('#トランザクションブロック1 - 終了')
    }
    return this.execAsyncFunctionWithTran(asyncFunc)
  }

  /**
   * トランザクション2(異常パターン)
   *
   * テーブルをクリアし、初期レコードを登録後、値が重複するレコード登録してエラーを発生させる。
   */
  tranBlock2ToFail () {
    const asyncFunc = async (conn) => {
      console.log('#トランザクションブロック2 - 開始')

      // テーブルクリア
      await conn.execute('DELETE FROM users')

      // 初期データ追加
      const values = [['taro', '太郎1'], ['hanako', '花子1'], ['jiro', '次郎1']]
      const sql = 'INSERT INTO users (account, name) VALUES ?'
      await conn.query(sql, [values])

      // 重複データでエラーを発生させる
      const values2 = [['taro', '太郎2'], ['hanako', '花子2'], ['jiro', '次郎2']]
      const sql2 = 'INSERT INTO users (account, name) VALUES ?'
      await conn.query(sql2, [values2])

      console.log('#トランザクションブロック2 - 終了')
    }
    return this.execAsyncFunctionWithTran(asyncFunc)
  }

  /**
   * トランザクション3(正常パターン)
   *
   * 登録データの一部を更新。
   */
  tranBlock3 () {
    const asyncFunc = async (conn) => {
      console.log('#トランザクションブロック3 - 開始')

      const sql = 'SELECT * FROM users WHERE account = ?'
      const [err, result] = await this.execQuery(sql, ['hanako'])
      if (err) throw new Error('トランザクションブロック3でエラー発生')
      const userid = result[0].id

      // データを更新
      const sql2 = 'UPDATE users SET name = ?  WHERE id = ?'
      await conn.query(sql2, ['団子', userid])

      console.log('#トランザクションブロック3 - 終了')
    }
    return this.execAsyncFunctionWithTran(asyncFunc)
  }

  /**
   * トランザクション4(異常パターン)
   *
   * テーブルをクリアし、例外を発生させて異常終了させる
   */
  tranBlock4ToFail () {
    const asyncFunc = async (conn) => {
      console.log('#トランザクションブロック4 - 開始')

      // テーブルクリア
      await conn.execute('DELETE FROM users')

      // 例外を発生させて異常終了
      throw new Error('トランザクションブロック4でエラー発生')

      console.log('#トランザクションブロック4 - 終了')
    }
    return this.execAsyncFunctionWithTran(asyncFunc)
  }
}
module.exports = UserDb
