import ConditionResolver from '@/Modules/Quote/Components/QuoteForm/UiRules/Conditions/ConditionResolver'
import UiRule from '@/Modules/Quote/Components/QuoteForm/UiRules/UiRule'
import { OPERATORS } from '@/Modules/Quote/Components/QuoteForm/UiRules/utils'
import UiRuleAction from '@/Modules/Quote/Components/QuoteForm/UiRules/Actions/UiRuleAction'
const math = require('mathjs')

const DEFAULT_PRECISION = 2

export default class Calculate extends UiRuleAction {
  constructor(baseNode) {
    super(baseNode, new ConditionResolver(baseNode))
  }

  static common() {
    return {
      uuidV4RegexForPath: new RegExp(
        /.[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}./i
      ),
    }
  }

  /**
   *
   * @param {object} rule
   * @returns {object} baseNode
   */
  execute(rule) {
    const uiRule = new UiRule(rule)

    if (uiRule.condition && !this.resolver.evaluateCondition(uiRule)) {
      return this.baseNode
    }

    const parser = math.parser()

    parser.set('sumMultiple', (property) => {
      const path = this.resolver.getPathToNode(property)
      const rowSourceProperty = path
        ? _.last(path.split(Calculate.common().uuidV4RegexForPath) || [''])
        : ''
      const [node] = property.split('.rows')

      if (node && rowSourceProperty && rowSourceProperty.length > 0) {
        const nodePath = node.replace(/\./g, '.properties.')
        const rows = _.get(this.baseNode.properties, `${nodePath}.rows`)
        const sumValues = _.map(rows, (row) => {
          const value = parseFloat(_.get(row, rowSourceProperty + '.value'))
          return isNaN(value) ? 0 : value
        }).join(',')

        if (sumValues) {
          return parser.evaluate(`sum(${sumValues})`)
        }

        return 0
      }

      return 0
    })

    const scope = this.getCalculationScope(rule)
    const precision = this.getCalculationPrecision(rule)

    let snakedFormula = rule.parameters.includes('sumMultiple')
      ? rule.parameters
      : this.prepareCalculateParams(rule.parameters)
          .map((expressionItem, index) => {
            if (
              OPERATORS.includes(expressionItem) ||
              !isNaN(Number(expressionItem))
            ) {
              return expressionItem
            }
            return expressionItem + '.' + index
          })
          .toString()
          .replace(/\,/g, ' ')

    _.each(scope, (value, key) => {
      snakedFormula = snakedFormula.replace(key, _.camelCase(key))
      parser.set(_.camelCase(key), value)
    })

    let value = parser.evaluate(snakedFormula, scope)
    value = math.round(value, precision)

    this.resolver.setValueToNode(rule.target, value, rule.trigger)

    return this.baseNode
  }

  prepareCalculateParams(parameters) {
    if (!parameters) return parameters
    return parameters
      .replace(/\)/g, ' ) ')
      .replace(/\(/g, ' ( ')
      .split(' ')
      .filter((item) => item && item.length > 0)
  }

  getCalculationScope(rule) {
    const expression = this.prepareCalculateParams(rule.parameters)
    return (
      expression &&
      expression.reduce((scope, expressionItem, index) => {
        if (
          OPERATORS.includes(expressionItem) ||
          !isNaN(Number(expressionItem))
        ) {
          return scope
        }
        const value = this.resolver.getValue(expressionItem)
        if (value !== undefined) {
          const numericValue = parseFloat(value)
          const key = expressionItem + '.' + index
          scope[key] = isNaN(numericValue) ? 0 : numericValue
        }
        return scope
      }, {})
    )
  }

  /**
   *
   * @param {object} rule
   * @returns {number}
   */
  getCalculationPrecision(rule) {
    const uiOptions = this.resolver.getUiOptions(rule.target)

    return isNaN(uiOptions?.precision) ? DEFAULT_PRECISION : uiOptions.precision
  }
}
