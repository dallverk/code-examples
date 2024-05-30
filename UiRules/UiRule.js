import _ from 'lodash'
import { DELIMITERS } from '@/Modules/Quote/Components/QuoteForm/UiRules/utils'
import math from '@/Modules/Quote/Components/QuoteForm/UiRules/Conditions/Math'

const TRIGGER_MAP = Object.freeze({
  onEdit: 'onEdit',
  input: 'input',
  onChange: 'onChange',
})

export default class UiRule {
  trigger = null
  action = null
  target = null
  condition = null
  parameters = null
  value = null
  emptyValueToNull = false

  constructor(data = {}) {
    _.forEach(data, (value, field) => {
      this[_.camelCase(field)] = value
    })
    if (!this.condition) delete this.emptyValueToNull
    this.assignTriggers()
  }

  static common() {
    return {
      conditionArguments: new RegExp(/\(.*\)/gm),
      parentheses: new RegExp(/\(|\)/gm),
      argumentSeparator: ', ',
      expressionSeparator: new RegExp(/\s|\(|\)|,/),
      operators: ['and', 'not', 'or', 'xor'],
      dotKey: new RegExp(/^(\w*\.)*\w+$/g),
      dotKeyMultipleSection: new RegExp(/\w+\.{\d+}\.\w+/gm),
      operatorsRegexp: new RegExp(/\+|\-|\*|\/|\%|\)|\)/gm),
      conditionStringArgument: new RegExp(/'[^']*'/gm),
      isMathFunction: (func) => typeof math[func] === 'function',
    }
  }

  static conditions() {
    return {
      evaluate: 'evaluate',
      compareText: 'compareText',
      matchSomeTextValue: 'matchSomeTextValue',
      range: 'range',
    }
  }

  /**
   *
   * @returns {array|undefined}
   */
  getConditionArguments() {
    if (typeof this.condition === 'string') {
      const args = this.condition.match(UiRule.common().conditionArguments)
      if (_.isArray(args)) {
        return _.first(args)
          .replace(UiRule.common().parentheses, '')
          .split(UiRule.common().argumentSeparator)
          .filter((item) => !!item)
      }
    }
  }

  /**
   *
   * @returns {array|undefined}
   */
  getTwoHandedConditionArguments() {
    if (!_.isString(this.condition)) {
      return
    }
    const source = this.condition
      .replace(/^.*\(/, '')
      .replace(/\)$/, '')
      .replace(UiRule.common().argumentSeparator, '_ ')
    return source.split('_ ').filter((item) => !!item)
  }

  /**
   *
   * @returns {string|undefined}
   */
  getConditionFunction() {
    if (typeof this.condition === 'string') {
      return _.first(this.condition.match(/^[A-z]+/))
    }
  }

  /**
   * @param {boolean|undefined} camelCaseKeys
   * @returns {string|undefined}
   */
  getEvaluateExpression(
    camelCaseKeys = false,
    scope = this.getEvaluateScope()
  ) {
    if (!_.isString(this.condition)) {
      return
    }

    let expression = this.condition.replace('evaluate(', '').replace(/\)$/, '')

    if (!camelCaseKeys) {
      return expression
    }

    _.keys(scope).forEach((key) => {
      expression = expression.replaceAll(key, _.camelCase(key))
    })

    return expression
  }

  /**
   *
   * @param {number|undefined} defaultValue
   * @returns {object|undefined}
   */
  getEvaluateScope(defaultValue = null) {
    let expr = this.condition.replace('evaluate(', '').replace(/\)$/, '')
    if (typeof expr === 'string') {
      return expr
        .replace(UiRule.common().conditionStringArgument, '') // Remove string arguments from expression
        .split(UiRule.common().expressionSeparator)
        .filter(
          (item) =>
            item &&
            !UiRule.common().operators.includes(item) &&
            isNaN(item) &&
            !UiRule.common().isMathFunction(item) &&
            !DELIMITERS.hasOwnProperty(item)
        )
        .reduce((acc, key) => {
          acc[key] = defaultValue
          return acc
        }, {})
    }
  }

  /**
   * @return {boolean}
   */
  isEvaluateCondition() {
    const func = this.getConditionFunction()
    if (_.isString(func)) {
      return func.includes(UiRule.conditions().evaluate)
    }
    return false
  }

  /**
   * @return {boolean}
   */
  isCompareTextCondition() {
    const func = this.getConditionFunction()
    if (_.isString(func)) {
      return func.includes(UiRule.conditions().compareText)
    }
    return false
  }

  /**
   * @return {boolean}
   */
  isCompareMultipleTextCondition() {
    const func = this.getConditionFunction()
    if (_.isString(func)) {
      return func.includes(UiRule.conditions().matchSomeTextValue)
    }
    return false
  }

  /**
   * @return {boolean}
   */
  isRangeCondition() {
    const func = this.getConditionFunction()
    if (_.isString(func)) {
      return func.includes(UiRule.conditions().range)
    }
    return false
  }

  /**
   *
   * @param {string} value
   * @return {array|null}
   */
  static getExpressionArrayTypeValue(value = '') {
    if (!_.isString(value)) {
      return null
    }
    return value.replace(/^\[\'/, '').replace(/\'\]$/, '').split("', '")
  }

  setTrigger(trigger = '') {
    this.trigger = trigger
  }

  setValue(value = '') {
    this.value = value
  }

  assignTriggers() {
    switch (this.trigger) {
      case TRIGGER_MAP.onEdit:
        this.setTrigger(TRIGGER_MAP.input)
        break
      default:
        break
    }
  }

  /**
   *
   * @param {*} value
   * @returns {*}
   */
  matchParameters(value) {
    if (!this.parameters) {
      return false
    }
    if (_.isEqual(this.parameters, value)) {
      return true
    }
    if (typeof this.parameters.includes === 'function') {
      return this.parameters.includes(value)
    }
  }

  replaceSourceWithParameter(value) {
    this.source = null

    if (_.isObject(value) && value.value) {
      this.parameters = value.value
      return
    }

    this.parameters = value
  }
}
