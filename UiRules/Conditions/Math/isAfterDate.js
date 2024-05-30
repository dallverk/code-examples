import moment from 'moment'
import { getDateFormat } from './dateTimeConfig'

function isAfterDate(a, b) {
  return moment(a).isAfter(b)
}

isAfterDate.transform = function (a, b) {
  const x = moment(a, getDateFormat())
  const y = moment(b, getDateFormat())

  return isAfterDate(x, y)
}

export default isAfterDate
