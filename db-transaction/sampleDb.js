const BaseDb = require('./baseDb')

class SampleDb extends BaseDb {
  getUserInfo (user, callback) {
    const sql = 'SELECT * FROM _login_user WHERE lu_account = ?'
    this.selectRecord(sql, [user], (err, result) => {
      if (err) {
        return callback(true)
      }
      callback(false, result)
    })
  }
}
module.exports = SampleDb
