import BaseNodeResolver from '@/Modules/Quote/Components/QuoteForm/UiRules/BaseNodeResolver'
import UiRule from '@/Modules/Quote/Components/QuoteForm/UiRules/UiRule'
import { DELIMITERS } from '@/Modules/Quote/Components/QuoteForm/UiRules/utils'
import math from '@/Modules/Quote/Components/QuoteForm/UiRules/Conditions/Math'

export default class ConditionResolver extends BaseNodeResolver {
  constructor(baseNode) {
    super(baseNode)
    this.baseNode = baseNode
  }
  static ROUNDING_DECIMALS() {
    return 2
  }
  static CONDITION_MESSAGES() {
    return {
      insufficientParams: 'Insufficient condition arguments',
      invalidCondition: 'Invalid condition function',
    }
  }
  /**
   * Evaluate ui rule condition
   * Invalid condition epxression returns true
   * Falsy source node value coerced to 0
   * @param {UiRule} uiRule
   * @returns {boolean}
   */
  evaluateCondition(uiRule = {}) {
    if (!(uiRule instanceof UiRule)) {
      return true
    }

    const func = uiRule.getConditionFunction()

    if (!_.isString(func)) {
      console.warn(ConditionResolver.CONDITION_MESSAGES().invalidCondition)
      return true
    }

    if (uiRule.isEvaluateCondition()) {
      const expr = uiRule.getEvaluateExpression(true)
      const scope = uiRule.getEvaluateScope()
      const hydratedScope = Object.keys(scope).reduce((acc, key) => {
        const value = this.getValue(key)

        if (uiRule.emptyValueToNull) {
          acc[_.camelCase(key)] = value === '' ? null : value
          return acc
        }

        acc[_.camelCase(key)] = value ?? ''
        return acc
      }, {})

      let result

      try {
        result = math.evaluate(expr, hydratedScope)
      } catch (err) {
        console.error(err)
        return false
      }

      return !!result
    }

    if (uiRule.isCompareTextCondition()) {
      const args = uiRule.getConditionArguments()
      const x = this.getValueByRuleOrSource(uiRule)
      const parseArguments = this.getConditionStringParseArguments(uiRule)

      if (parseArguments.length === 0) {
        console.warn(ConditionResolver.CONDITION_MESSAGES().insufficientParams)
        return true
      }

      if (args.length > 1) {
        return math.parse(`${func}(${parseArguments})`).evaluate() === 0
      }

      return math.parse(`${func}('${x}', ${parseArguments})`).evaluate() === 0
    }

    if (uiRule.isCompareMultipleTextCondition()) {
      const args = uiRule.getTwoHandedConditionArguments()

      if (_.isEmpty(args)) {
        return false
      }

      const textXArg = _.first(args)
      const textX = textXArg.match(UiRule.common().conditionStringArgument)
        ? textXArg.replace(/^\'/, '').replace(/\'$/, '')
        : this.getValue(textXArg)

      const textY = _.last(args)
      if (!textX || !textY) {
        return false
      }

      const textYArray = UiRule.getExpressionArrayTypeValue(textY)
      if (!textYArray) {
        return false
      }

      return math.compareText(textX, textYArray).some((item) => item === 0)
    }

    const parseArguments = this.getConditionNumericParseArguments(uiRule)

    if (parseArguments.length === 0) {
      console.warn(ConditionResolver.CONDITION_MESSAGES().insufficientParams)
      return true
    }

    const x = Number(this.getValueByRuleOrSource(uiRule))

    if (uiRule.isRangeCondition() && math.hasNumericValue(x)) {
      const range = math.parse(`${func}(${parseArguments})`).evaluate()
      return range.toArray().includes(x)
    }

    if (func && math.hasNumericValue(x)) {
      return math.parse(`${func}(${x}, ${parseArguments})`).evaluate()
    }

    return true
  }

  /**
   * @param {object} uiRule
   * @returns {string}
   */
  getConditionStringParseArguments(uiRule) {
    const args = uiRule.getConditionArguments()
    return (
      _.isArray(args)
        ? args.map((arg) => {
            if (arg.match(UiRule.common().conditionStringArgument)) {
              return arg
            }
            return `'${this.getValue(arg)}'`
          })
        : []
    ).join(', ')
  }

  /**
   * @param {object} uiRule
   * @returns {string}
   */
  getConditionNumericParseArguments(uiRule = {}) {
    const args = uiRule.getConditionArguments()
    return (
      _.isArray(args)
        ? args.map((arg) => {
            if (math.hasNumericValue(arg)) {
              return arg
            }
            return this.getValue(arg)
          })
        : []
    ).join(', ')
  }

  /**
   * Parse a condition string for math evaluation
   * @param {string} expr
   * @returns {boolean | undefined}
   */
  evaluateMathExpression(expr = '') {
    if (!expr) return
    const isExpressionNode = (str) => DELIMITERS.hasOwnProperty(str)
    const evalStr = expr
      .split(' ')
      .map((item) => {
        if (isExpressionNode(item) || !isNaN(item)) {
          return item
        }
        const val = this.getValueFromRuleSource(item)
        return val ? val : 0
      })
      .join(' ')

    try {
      return math.round(
        math.evaluate(evalStr),
        ConditionResolver.ROUNDING_DECIMALS()
      )
    } catch (error) {
      console.error(error)
    }
  }
}
