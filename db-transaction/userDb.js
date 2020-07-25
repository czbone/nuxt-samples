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
   * 
   * @return {Array} エラーの有無(numberのエラーコードまたはfalse(エラーなし))と同期関数の戻り値(任意)の配列
   */
  async tranBlock1 () {
    const asyncFunc = async (conn) => {
      console.log('#トランザクションブロック1 - 開始')

      // テーブルクリア
      await conn.execute('DELETE FROM users')

      // 初期データ追加
      const values = [['taro', '太郎'], ['hanako', '花子'], ['jiro', '次郎']]
      const sql = 'INSERT INTO users (account, name) VALUES ?'
      await conn.query(sql, [values])

      console.log('#トランザクションブロック1 - 終了')

      // トランザクションブロックの終了値が必要な場合はreturnで返す
      return 100
    }
    return this.execAsyncFunctionWithTran(asyncFunc)
  }

  /**
   * トランザクション2(異常パターン)
   *
   * テーブルをクリアし、初期レコードを登録後、値が重複するレコード登録してエラーを発生させる。
   * 
   * @return {Array} エラーの有無(numberのエラーコードまたはfalse(エラーなし))と同期関数の戻り値(任意)の配列
   */
  async tranBlock2ToFail () {
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
   * 
   * @return {Array} エラーの有無(numberのエラーコードまたはfalse(エラーなし))と同期関数の戻り値(任意)の配列
   */
  async tranBlock3 () {
    const asyncFunc = async (conn) => {
      console.log('#トランザクションブロック3 - 開始')

      const sql = 'SELECT * FROM users WHERE account = ?'
      const [rows, fields] = await conn.execute(sql, ['hanako'])
      const userid = rows[0].id

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
   * 
   * @return {Array} エラーの有無(numberのエラーコードまたはfalse(エラーなし))と同期関数の戻り値(任意)の配列
   */
  async tranBlock4ToFail () {
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
