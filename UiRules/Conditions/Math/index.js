import { create, all } from 'mathjs'

import isBeforeDate from './isBeforeDate'
import isAfterDate from './isAfterDate'
import isSameOrBeforeDate from './isSameOrBeforeDate'
import isSameOrAfterDate from './isSameOrAfterDate'
import isSameDate from './isSameDate'
import contains from './contains'

const math = create(all)

math.import({
  isBeforeDate,
  isAfterDate,
  isSameOrBeforeDate,
  isSameOrAfterDate,
  isSameDate,
  contains,
})

export default math
