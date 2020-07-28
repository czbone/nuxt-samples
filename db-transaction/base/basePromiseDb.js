/**
 * Promise型DBアクセスベースクラス
 *
 * @author Naoki Hirata
 * @since  1.0.0
 */
const config = require('./config') // サーバ実行環境取得

const mysql = require('mysql2/promise')
const pool = mysql.createPool({
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  user: config.dbUser,
  password: config.dbPassword,
  connectionLimit: 10, // 接続コネクション数最大(デフォルト)
  connectTimeout: 60000
})

class BasePromiseDb {
  constructor () {
    this.pool = pool
  }

  /**
   * SQLクエリーを実行する
   *
   * @since  1.0.0
   * @access public
   * @param  {string} query SELECT文
   * @param  {Array} params クエリーに埋め込むパラメータ
   * @return {Promise.<[boolean, Array]>} Promiseオブジェクト(resultでエラーの有無(numberのエラーコードまたはfalse(エラーなし))と結果レコード配列を配列で返す)
   */
  async execQuery (query, params) {
    let errCode = -1
    let connection

    try {
      errCode = 50
      connection = await this.pool.getConnection()

      errCode = 51
      const [rows] = await connection.execute(query, params)

      // 取得レコードを返す
      return [false, rows]
    } catch (err) {
      let optionMessage

      switch (errCode) {
        case 50: // DB接続エラー
          optionMessage = 'DB接続エラー(host:' + config.dbHost + ', port:' + config.dbPort + ', database:' + config.dbName + ', user:' + config.dbUser + ')'
          log.dbError(err, errCode, optionMessage)
          break
        case 51: // クエリー実行エラー
          optionMessage = 'クエリー実行エラー'
          const optionObj = { query: query, params: params }
          log.dbError(err, errCode, optionMessage, optionObj)
          break
        default:
          log.dbError(err, errCode)
      }
      return [errCode]
    } finally {
      if (connection) connection.release()
    }
  }

  /**
   * トランザクションを使用して複数クエリーを実行する
   *
   * @since  1.0.0
   * @access public
   * @param  {Array} statements クエリー(query)とパラメータ(param)の配列
   * @return {Promise.<boolean>} Promiseオブジェクト(resultでエラーの有無(numberのエラーコードまたはfalse(エラーなし))を返す)
   */
  async execQueryWithTran (statements) {
    let errCode = -1 // エラーコード初期化(未定義値)
    let connection
    let query, param

    try {
      // コネクション取得
      errCode = 60
      connection = await this.pool.getConnection()

      // トランザクション開始
      errCode = 61
      await connection.beginTransaction()

      // クエリー実行
      errCode = 62
      for (let i = 0; i < statements.length; i++) {
        query = statements[i].query
        param = statements[i].param
        await connection.execute(query, param)
      }

      // トランザクション終了
      errCode = 63
      await connection.commit()

      // 実行結果を返す
      return false
    } catch (err) {
      // トランザクション中断
      if (connection) await connection.rollback()

      let optionMessage

      switch (errCode) {
        case 60: // DB接続エラー
          optionMessage = 'DB接続エラー(host:' + config.dbHost + ', port:' + config.dbPort + ', database:' + config.dbName + ', user:' + config.dbUser + ')'
          log.dbError(err, errCode, optionMessage)
          break
        case 62: // クエリー実行エラー
          optionMessage = 'クエリー実行エラー'
          const optionObj = { query: query, params: param }
          log.dbError(err, errCode, optionMessage, optionObj)
          break
        default:
          log.dbError(err, errCode)
      }

      // エラーコードを返す
      return errCode
    } finally {
      if (connection) connection.release()
    }
  }

  /**
   * トランザクションを使用して同期関数を実行する
   *
   * @since  1.0.0
   * @access public
   * @param  {function} asyncFunc 同期関数
   * @return {Promise.<[boolean, any]>} Promiseオブジェクト(resultでエラー有無(numberのエラーコードまたはfalse(エラーなし))と同期関数の戻り値(任意)を配列で返す)
   */
  async execAsyncFunctionWithTran (asyncFunc) {
    let errCode = -1 // エラーコード初期化(未定義値)
    let connection

    try {
      // コネクション取得
      errCode = 70
      connection = await this.pool.getConnection()

      // トランザクション開始
      errCode = 71
      await connection.beginTransaction()

      // 同期関数実行
      errCode = 72
      const result = await asyncFunc(connection)

      // トランザクション終了
      errCode = 73
      await connection.commit()

      // 実行結果を返す
      return [false, result]
    } catch (err) {
      // トランザクション中断
      if (connection) await connection.rollback()

      switch (errCode) {
        case 70: // DB接続エラー
          const optionMessage = 'DB接続エラー(host:' + config.dbHost + ', port:' + config.dbPort + ', database:' + config.dbName + ', user:' + config.dbUser + ')'
          log.dbError(err, errCode, optionMessage)
          break
        default:
          log.dbError(err, errCode)
      }

      // エラーコードを返す
      return [errCode]
    } finally {
      if (connection) connection.release()
    }
  }
}
module.exports = BasePromiseDb
