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
   * [Non Promise共通インターフェイス] SELECT文を実行し、レコードを取得する
   *
   * @since  1.0.0
   * @access public
   * @param  {string} query SELECT文
   * @param  {Array} params クエリーに埋め込むパラメータ
   * @param  {function} callback コールバック関数
   */
  async selectRecord (query, params, callback) {
    let errCode = -1
    let connection

    try {
      errCode = 10
      connection = await this.pool.getConnection()

      errCode = 11
      const [rows] = await connection.execute(query, params)

      // 取得レコードを返す
      callback(false, rows)
    } catch (err) {
      let optionMessage

      switch (errCode) {
        case 10: // DB接続エラー
          optionMessage = 'DB接続エラー(host:' + config.dbHost + ', port:' + config.dbPort + ', database:' + config.dbName + ', user:' + config.dbUser + ')'
          log.dbError(err, errCode, optionMessage)
          break
        case 11: // クエリー実行エラー
          optionMessage = 'クエリー実行エラー'
          const optionObj = { query: query, params: params }
          log.dbError(err, errCode, optionMessage, optionObj)
          break
        default:
          log.dbError(err, errCode)
      }
      callback(errCode)
    } finally {
      if (connection) connection.release()
    }
  }

  /**
   * [Non Promise共通インターフェイス] DBを更新するSQLクエリー(INSERT,UPDATE等)を実行する
   *
   * @since  1.0.0
   * @access public
   * @param  {string} query SELECT文
   * @param  {Array} params クエリーに埋め込むパラメータ
   * @param  {function} callback コールバック関数
   */
  async execStatement (query, params, callback) {
    let errCode = -1
    let connection

    try {
      errCode = 20
      connection = await this.pool.getConnection()

      errCode = 21
      await connection.execute(query, params)

      // 正常終了を返す
      callback(false)
    } catch (err) {
      let optionMessage

      switch (errCode) {
        case 20: // DB接続エラー
          optionMessage = 'DB接続エラー(host:' + config.dbHost + ', port:' + config.dbPort + ', database:' + config.dbName + ', user:' + config.dbUser + ')'
          log.dbError(err, errCode, optionMessage)
          break
        case 21: // クエリー実行エラー
          optionMessage = 'クエリー実行エラー'
          const optionObj = { query: query, params: params }
          log.dbError(err, errCode, optionMessage, optionObj)
          break
        default:
          log.dbError(err, errCode)
      }
      callback(errCode)
    } finally {
      if (connection) connection.release()
    }
  }

  /**
   * [Non Promise共通インターフェイス] JSONデータありのデータでDBを更新するSQLクエリー(INSERT,UPDATE等)を実行
   *
   * @since  1.0.0
   * @access public
   * @param  {string} query SELECT文
   * @param  {Array} params クエリーに埋め込むパラメータ
   * @param  {function} callback コールバック関数
   */
  async queryStatement (query, params, callback) {
    let errCode = -1
    let connection

    try {
      errCode = 30
      connection = await this.pool.getConnection()

      errCode = 31
      await connection.query(query, params)

      // 正常終了を返す
      callback(false)
    } catch (err) {
      let optionMessage

      switch (errCode) {
        case 30: // DB接続エラー
          optionMessage = 'DB接続エラー(host:' + config.dbHost + ', port:' + config.dbPort + ', database:' + config.dbName + ', user:' + config.dbUser + ')'
          log.dbError(err, errCode, optionMessage)
          break
        case 31: // クエリー実行エラー
          optionMessage = 'クエリー実行エラー'
          const optionObj = { query: query, params: params }
          log.dbError(err, errCode, optionMessage, optionObj)
          break
        default:
          log.dbError(err, errCode)
      }
      callback(errCode)
    } finally {
      if (connection) connection.release()
    }
  }

  /**
   * SQLクエリーを実行する
   *
   * @since  1.0.0
   * @access public
   * @param  {string} query SELECT文
   * @param  {Array} params クエリーに埋め込むパラメータ
   * @return {Array} 実行結果(エラーありかどうかと結果レコードの配列(エラーの場合はエラーコード)
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
   * @return {bool} エラーありかどうか。エラーの場合はエラーコード。
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
   * @return {Array} エラーの有無(numberのエラーコードまたはfalse(エラーなし))と同期関数の戻り値(任意)の配列
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
