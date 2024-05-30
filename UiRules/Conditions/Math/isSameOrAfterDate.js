import moment from 'moment'
import { getDateFormat } from './dateTimeConfig'

function isSameOrAfterDate(a, b) {
  return moment(a).isSameOrAfter(b)
}

isSameOrAfterDate.transform = function (a, b) {
  const x = moment(a, getDateFormat())
  const y = moment(b, getDateFormat())

  return isSameOrAfterDate(x, y)
}

export default isSameOrAfterDate
