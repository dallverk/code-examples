import ConditionResolver from '@/Modules/Quote/Components/QuoteForm/UiRules/Conditions/ConditionResolver'
import UiRule from '@/Modules/Quote/Components/QuoteForm/UiRules/UiRule'

describe('ConditionResolver', () => {
  let resolver
  let baseNode
  let uiRule

  beforeEach(() => {
    uiRule = null
    baseNode = {
      properties: {
        inceptionDate: {
          uiType: 'date',
          value: '2023-01-12',
        },
        expiryDate: {
          uiType: 'date',
          value: '2024-05-24',
        },
        premium: {
          uiType: 'number',
          value: 100,
        },
        usage: {
          uiType: 'select',
          value: 'Class 1',
        },
      },
    }
    resolver = new ConditionResolver(baseNode)
  })

  it('should have working constructor', () => {
    expect(resolver).toBeTruthy()
  })

  describe('condition with contains', () => {
    it('should evaluate contains', () => {
      uiRule = new UiRule({
        action: 'test',
        condition: "evaluate(contains('Quote', 'Schema'))",
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(false)

      uiRule = new UiRule({
        action: 'test',
        condition: "evaluate(contains('Quote', 'Quote'))",
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(true)

      uiRule = new UiRule({
        action: 'test',
        condition: "evaluate(contains(usage, 'Class'))",
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(true)

      uiRule = new UiRule({
        action: 'test',
        condition: "evaluate(contains(usage, 'Class 2'))",
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(false)
    })
  })

  describe('condition with compare date functions', () => {
    it('should evaluate isBeforeDate', () => {
      uiRule = new UiRule({
        action: 'test',
        condition: "evaluate(isBeforeDate('2024-05-24', '2023-01-12'))",
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(false)

      uiRule = new UiRule({
        action: 'test',
        condition: "evaluate(isBeforeDate('2024-05-24', '2024-05-25'))",
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
    })

    it('should evaluate isSameDate', () => {
      uiRule = new UiRule({
        action: 'test',
        condition: "evaluate(isSameDate('2024-05-24', '25-05-2024'))",
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(false)

      uiRule = new UiRule({
        action: 'test',
        condition:
          "evaluate(isSameDate('2024-05-24', '2024-05-24') and isAfterDate('2024-05-24', '2023-01-12'))",
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
    })

    it('should evaluate isBeforeDate with quote field', () => {
      uiRule = new UiRule({
        action: 'test',
        condition: "evaluate(isBeforeDate('2023-01-12', inceptionDate))",
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(false)

      uiRule = new UiRule({
        action: 'test',
        condition: 'evaluate(isBeforeDate(inceptionDate, expiryDate))',
      })

      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
    })
  })

  describe('evaluateCondition method', () => {
    it('should return true if uiRule is not instance of UiRule', () => {
      expect(resolver.evaluateCondition({})).toEqual(true)
    })

    it('should return true if failed to get condition for uiRule', () => {
      uiRule = new UiRule({})
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
    })

    it('should evaluate condition and return boolean', () => {
      uiRule = new UiRule({
        condition: 'evaluate(1 == 1)',
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
      uiRule = new UiRule({
        condition: 'evaluate(1 != 1)',
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(false)
    })

    it('should evaluate condition function and return boolean', () => {
      uiRule = new UiRule({
        condition:
          "evaluate(compareText('Jet Sky Express', 'Jet Sky Express') == 0)",
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
      uiRule = new UiRule({
        condition: 'evaluate(compareNatural(1, 1) != 0)',
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(false)
    })

    it('should evaluate compareText condition and return boolean', () => {
      uiRule = new UiRule({
        condition: "compareText('A', 'A')",
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
      uiRule = new UiRule({
        condition: "compareText('A', 'B')",
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(false)
    })

    it('should evaluate matchSomeTextValue and return boolean', () => {
      uiRule = new UiRule({
        condition: "matchSomeTextValue('A', ['A'])",
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
      uiRule = new UiRule({
        condition: "matchSomeTextValue('A', ['B'])",
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(false)
    })

    it('should evaluate matchSomeTextValue and return true if at least one match found', () => {
      uiRule = new UiRule({
        condition: "matchSomeTextValue('A', ['C', 'A', 'B'])",
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
    })

    it('should evaluate matchSomeTextValue using node source and return boolean', () => {
      uiRule = new UiRule({
        condition: "matchSomeTextValue(usage, ['Class 1', 'Class 2'])",
        source: 'usage',
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)

      resolver = new ConditionResolver({
        properties: {
          usage: {
            uiType: 'select',
            value: 'Class 3',
          },
        },
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(false)
    })

    it('should evaluate range condition and return boolean', () => {
      uiRule = new UiRule({
        condition: 'range(1, 100)',
        value: 1,
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
      uiRule = new UiRule({
        condition: 'range(-1, 1)',
        value: 0,
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
      uiRule = new UiRule({
        condition: 'range(99, 100)',
        value: 1,
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(false)
    })

    it('should evaluate smallerEq condition and return boolean', () => {
      uiRule = new UiRule({
        condition: 'smallerEq(2)',
        value: 1,
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
      uiRule = new UiRule({
        condition: 'smallerEq(2)',
        value: 2,
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
      uiRule = new UiRule({
        condition: 'smallerEq(2)',
        value: 3,
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(false)
    })

    it('should evaluate smallerEq condition using node source and return boolean', () => {
      uiRule = new UiRule({
        condition: 'smallerEq(2)',
        source: 'premium',
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(false)

      uiRule = new UiRule({
        condition: 'smallerEq(1000)',
        source: 'premium',
      })
      expect(resolver.evaluateCondition(uiRule)).toEqual(true)
    })
  })
})
