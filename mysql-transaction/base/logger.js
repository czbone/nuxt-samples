/**
 * ログ出力設定クラス
 *
 * ログ出力の設定を行う
 *
 * @author Naoki Hirata
 * @since  1.0.0
 */
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format

// ログはコンソールとファイルに出力
var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'info',    // or 'debug'
    handleExceptions: true,
    json: false,
    colorize: true,
  }
}

// コーススタックの出力
// 呼び出し引数にエラーオブジェクトある場合はコールスタックを出力
const errorStackTracerFormat = format(info => {
  if (info instanceof Error) { // エラーオブジェクトのみの場合
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message, // エラーオブジェクトに設定されているメッセージを取得
      optionCode: info.optionCode, // logモジュールで付加したパラメータ
      optionMessage: info.optionMessage, // logモジュールで付加したパラメータ
      optionObj: info.optionObj // logモジュールで付加したオブジェクトパラメータ
    })
  } else if (info.message instanceof Error) { // Errorオブジェクトとテキストエラーメッセージの場合
    return Object.assign({}, info, {
      stack: info.message.stack,
      optionMessage: info.message.optionMessage // logモジュールで付加したパラメータ
    })
  }
  return info
})

// メッセージの出力フォーマット
const customFormat = printf(({ level, message, label, timestamp, stack, optionCode, optionMessage, optionObj }) => {
  let msgFormat = `${timestamp} [${level}]`
  if (stack) {
    if (optionCode) msgFormat += ` ${optionCode}`
    if (optionMessage) msgFormat += ` ${optionMessage}`
    if (optionObj) msgFormat += ' ' + JSON.stringify(optionObj)
    msgFormat += ` ${stack}` // 関数スタック出力
  } else {
    msgFormat += ` ${message}`
  }
  return msgFormat
})

// instantiate a new Winston Logger with the settings defined above
var logger = createLogger({
  format: format.combine(
    format.splat(), // printf出力が可能
    format.timestamp({    // タイムスタンプを付加
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.simple(),     // 呼び出し時のメッセージ引数を出力
    errorStackTracerFormat(),   // メッセージのパラメータを調整
    customFormat    // メッセージの出力フォーマット
  ),
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
})
module.exports = logger
