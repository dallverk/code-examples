import ConditionResolver from '@/Modules/Quote/Components/QuoteForm/UiRules/Conditions/ConditionResolver'
import UiRule from '@/Modules/Quote/Components/QuoteForm/UiRules/UiRule'
import UiRuleAction from '@/Modules/Quote/Components/QuoteForm/UiRules/Actions/UiRuleAction'
import moment from 'moment'

export default class CalculateDuration360 extends UiRuleAction {
  constructor(baseNode, dateFormat) {
    super(baseNode, new ConditionResolver(baseNode))
    this.dateFormat = dateFormat
  }

  /**
   *
   * @param {moment} date
   * @returns {boolean|undefined}
   */
  static isLastDay = (date) => {
    if (!moment.isMoment(date)) {
      return
    }

    const lastDayOfFeb = new Date(date.year(), 2, 0).getDate()

    if (date.month() === 1 && date.date() === lastDayOfFeb) {
      return true
    }

    return false
  }

  /**
   *
   * @param {moment} dateA
   * @param {moment} dateB
   * @param {string} format
   * @returns {number|Error}
   */
  static getFinancialDateDiff(dateA, dateB, { format, daysInYear = 360 } = {}) {
    const momentA = moment.isMoment(dateA) ? dateA : moment.utc(dateA, format)
    const momentB = moment.isMoment(dateB) ? dateB : moment.utc(dateB, format)

    let dayA = momentA.date()
    let dayB = momentB.date()

    if (
      CalculateDuration360.isLastDay(momentA) &&
      CalculateDuration360.isLastDay(momentB)
    ) {
      dayB = 30
    }

    if (dayA === 31 || CalculateDuration360.isLastDay(momentA)) {
      dayA = 30
    }

    if (dayA === 30 && dayB === 31) {
      dayB = 30
    }

    return (
      (momentB.year() - momentA.year()) * daysInYear +
      (momentB.month() - momentA.month()) * 30 +
      (dayB - dayA)
    )
  }

  /**
   *
   * @param {object} rule
   * @returns {object} baseNode
   */
  execute(rule) {
    const uiRule = new UiRule(rule)

    const [valueA, valueB] = this.resolver.getMultipleSourceValue(uiRule.source)

    const dateA = moment.utc(valueA, this.dateFormat)
    const dateB = moment.utc(valueB, this.dateFormat)

    const { daysInYear } = uiRule.parameters || {}

    let result = CalculateDuration360.getFinancialDateDiff(dateA, dateB, {
      daysInYear,
    })

    this.resolver.setValueToNode(uiRule.target, result, uiRule.trigger)

    return this.baseNode
  }
}
