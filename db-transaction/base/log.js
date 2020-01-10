/**
 * ログ出力クラス
 *
 * システムからのログ出力を行う。開発時はコンソールにも出力する。
 * ・メッセージの種別は、DB関係(db)、セキュリティ関係(security)、その他(指定なし)で区別。
 * ・各種別ごとにレベル(error(システムエラー), warn(対処すべき事象), info(対処必要なし))を指定する。
 *
 * @author Naoki Hirata
 * @since  1.0.0
 */
const logger = require('./logger')

// loggerの関数に渡せるパラメータ数が1の場合、テキストのメッセージかErrorオブジェクトを渡す
// Errorオブジェクトパラメータ例) new Error("some additional message")
// loggerの関数に渡せるパラメータ数が2の場合、Errorオブジェクトとテキストのメッセージを渡す
exports.error = (errObj, optionMessage) => {
  if (optionMessage) errObj.optionMessage = optionMessage
  logger.error(errObj)
}
exports.dbError = (errObj, code, optionMessage, optionObj) => {
  if (code) errObj.optionCode = '[db-' + code + ']' // オプションメッセーにコード番号追加
  if (optionMessage) errObj.optionMessage = optionMessage
  if (optionObj) errObj.optionObj = optionObj
  logger.error(errObj)
}
exports.warn = (message) => {
  logger.warn(message)
}
exports.validateError = (req, message) => {
  const url = req.protocol + ':/' + req.headers.host + req.baseUrl
  let msg = message + ' url: ' + url + ' '
  if (Object.keys(req.body).length) msg += JSON.stringify(req.body)
  if (Object.keys(req.query).length) msg += JSON.stringify(req.query)

  logger.warn('[validate] ' + msg)
}
exports.info = (message) => {
  logger.info(message)
}
exports.debug = (message) => {
  logger.debug(message)
}
/**
 * セキュリティメッセージ出力用関数
 */
/*
 * 対処の必要のないセキュリティ情報(セキュリティレベル低)を出力
 *
 * @since  1.0.0
 * @access public
 * @param  {string} message メッセージ
 */
exports.securityInfo = (message) => {
  logger.info('[security] ' + message)
}
/*
 * 対処が必要な要注意セキュリティ情報(セキュリティレベル高)を出力
 *
 * @since  1.0.0
 * @access public
 * @param  {string} message メッセージ
 */
exports.securityWarn = (message) => {
  logger.warn('[security] ' + message)
}
