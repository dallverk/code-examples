import moment from 'moment'
import { getDateFormat } from './dateTimeConfig'

function isBeforeDate(a, b) {
  return moment(a).isBefore(b)
}

isBeforeDate.transform = function (a, b) {
  const x = moment(a, getDateFormat())
  const y = moment(b, getDateFormat())

  return isBeforeDate(x, y)
}

export default isBeforeDate
