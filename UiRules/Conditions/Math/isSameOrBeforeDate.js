import moment from 'moment'
import { getDateFormat } from './dateTimeConfig'

function isSameOrBeforeDate(a, b) {
  return moment(a).isSameOrBefore(b)
}

isSameOrBeforeDate.transform = function (a, b) {
  const x = moment(a, getDateFormat())
  const y = moment(b, getDateFormat())

  return isSameOrBeforeDate(x, y)
}

export default isSameOrBeforeDate
