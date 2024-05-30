import moment from 'moment'
import { getDateFormat } from './dateTimeConfig'

function isSameDate(a, b) {
  return moment(a).isSame(b)
}

isSameDate.transform = function (a, b) {
  const x = moment(a, getDateFormat())
  const y = moment(b, getDateFormat())

  return isSameDate(x, y)
}

export default isSameDate
