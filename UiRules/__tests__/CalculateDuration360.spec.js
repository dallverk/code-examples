import CalculateDuration360 from '@/Modules/Quote/Components/QuoteForm/UiRules/Actions/CalculateDuration360'

describe('CalculateDuration360', () => {
  let action
  let baseNode
  let uiRule
  let format = 'YYYY-MM-DD'

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
          value: '2024-01-12',
        },
        premium: {
          uiType: 'number',
          value: 100,
        },
      },
    }
    action = new CalculateDuration360(baseNode, format)
  })

  it('should return correct baseNode', () => {
    uiRule = {
      target: 'premium',
      source: ['inceptionDate', 'expiryDate'],
    }
    expect(action.execute(uiRule)).toEqual({
      properties: {
        inceptionDate: {
          uiType: 'date',
          value: '2023-01-12',
        },
        expiryDate: {
          uiType: 'date',
          value: '2024-01-12',
        },
        premium: {
          uiType: 'number',
          value: 360,
        },
      },
    })
  })

  describe('getFinancialDateDiff method', () => {
    it('should accept daysInYear argument', () => {
      let result = CalculateDuration360.getFinancialDateDiff(
        '2022-05-30',
        '2023-05-30',
        { daysInYear: 365 }
      )
      expect(result).toEqual(365)
    })

    it('should return days difference of financial year between 2 dates', () => {
      let result = CalculateDuration360.getFinancialDateDiff(
        '2022-05-30',
        '2022-09-02'
      )
      expect(result).toEqual(92)

      result = CalculateDuration360.getFinancialDateDiff(
        '1-Jan-2021',
        '31-Dec-2021',
        { format: 'D-MMM-YYYY' }
      )
      expect(result).toEqual(360)

      result = CalculateDuration360.getFinancialDateDiff(
        '1-Jan-2021',
        '31-Dec-2022',
        { format: 'D-MMM-YYYY' }
      )
      expect(result).toEqual(720)

      result = CalculateDuration360.getFinancialDateDiff(
        '1-Feb-2021',
        '1-Mar-2021',
        { format: 'D-MMM-YYYY' }
      )
      expect(result).toEqual(30)

      result = CalculateDuration360.getFinancialDateDiff(
        '1-Jun-2021',
        '1-Nov-2021',
        { format: 'D-MMM-YYYY' }
      )
      expect(result).toEqual(150)

      result = CalculateDuration360.getFinancialDateDiff(
        '10-Sep-2021',
        '10-Dec-2021',
        { format: 'D-MMM-YYYY' }
      )
      expect(result).toEqual(90)

      result = CalculateDuration360.getFinancialDateDiff(
        '1-Jul-2021',
        '31-Dec-2021',
        { format: 'D-MMM-YYYY' }
      )
      expect(result).toEqual(180)

      result = CalculateDuration360.getFinancialDateDiff(
        '1-Apr-2021',
        '31-Dec-2021',
        { format: 'D-MMM-YYYY' }
      )
      expect(result).toEqual(270)
    })
  })
})
