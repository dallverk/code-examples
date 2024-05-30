import UiRule from '@/Modules/Quote/Components/QuoteForm/UiRules/UiRule'

describe('UiRule', () => {
  let uiRule

  beforeEach(() => {
    uiRule = null
  })

  it('should have working constructor', () => {
    uiRule = new UiRule({ action: 'test' })
    expect(uiRule).toBeTruthy()
  })

  describe('getEvaluateScope method', () => {
    it('should return correct scope', () => {
      uiRule = new UiRule({
        action: 'test',
        condition:
          "evaluate(compareText(quote.distribution, 'Canada (Quebec)') == 0 or compareText(quote.distribution, 'Jet Ski Express') == 0)",
      })
      let res = uiRule.getEvaluateScope(null)
      expect(res).toEqual({ 'quote.distribution': null })
    })
  })

  describe('getEvaluateExpression method', () => {
    it('should return unmodified expression', () => {
      uiRule = new UiRule({ action: 'test', condition: 'abc' })
      let res = uiRule.getEvaluateExpression()
      expect(res).toEqual('abc')
    })

    it('should return expression with camcelCased node path correctly', () => {
      uiRule = new UiRule({
        condition: "evaluate(compareText(pci, '1-10.000') == 0)",
      })
      let res = uiRule.getEvaluateExpression(true)
      expect(res).toEqual("compareText(pci, '1-10.000') == 0")

      uiRule = new UiRule({
        condition:
          "evaluate(compareText(questionnaire.sensitiveRecords.pci, '100.001-200.000') == 0)",
      })
      res = uiRule.getEvaluateExpression(true)
      expect(res).toEqual(
        "compareText(questionnaireSensitiveRecordsPci, '100.001-200.000') == 0"
      )

      uiRule = new UiRule({
        condition: "evaluate(compareText(pci, '0') == 0)",
      })
      res = uiRule.getEvaluateExpression(true)
      expect(res).toEqual("compareText(pci, '0') == 0")

      uiRule = new UiRule({
        condition: 'evaluate(compareText(pci, 0) == 0)',
      })
      res = uiRule.getEvaluateExpression(true)
      expect(res).toEqual('compareText(pci, 0) == 0')

      uiRule = new UiRule({
        condition:
          'evaluate(compareText(questionnaire.sensitiveRecords.{0}.pci, 0) == 0)',
      })
      res = uiRule.getEvaluateExpression(true)
      expect(res).toEqual(
        'compareText(questionnaireSensitiveRecords0Pci, 0) == 0'
      )
    })
  })
})
