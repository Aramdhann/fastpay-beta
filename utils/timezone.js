const moment = require('moment-timezone')

// const gmt7Date = moment().tz('Asia/Jakarta').toDate()
const gmt7Date = (date) => {
  moment(date).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
}

module.exports = gmt7Date
