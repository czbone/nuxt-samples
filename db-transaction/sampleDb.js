const BaseDb = require('./base/basePromiseDb')

class SampleDb extends BaseDb {
  getUserInfo (user, callback) {
    const sql = 'SELECT * FROM users WHERE account = ?'
    this.selectRecord(sql, [user], (err, result) => {
      if (err) {
        return callback(true)
      }
      callback(false, result)
    })
  }
}
module.exports = SampleDb
