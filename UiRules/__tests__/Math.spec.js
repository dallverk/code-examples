import math from '@/Modules/Quote/Components/QuoteForm/UiRules/Conditions/Math'

jest.mock(
  '@/Modules/Quote/Components/QuoteForm/UiRules/Conditions/Math/dateTimeConfig',
  () => ({
    getDateFormat: () => 'YYYY-MM-DD',
  })
)

describe('Math custom functions', () => {
  it('should import math with evaluate', () => {
    expect(math.evaluate).toBeTruthy()
  })

  describe('String functions', () => {
    it('should evaluate contains correctly', () => {
      expect(math.evaluate("contains('QuoteSchema', 'Schema')")).toEqual(true)

      expect(math.evaluate("contains('Quoteschema', 'Schema')")).toEqual(false)

      expect(math.evaluate("contains('quoteSchema', 'Schema')")).toEqual(true)

      expect(math.evaluate("contains('QuoteSchema ', 'Schema ')")).toEqual(true)

      expect(math.evaluate("contains('QuoteSchema', 'Schem0')")).toEqual(false)
    })
  })

  describe('Date functions', () => {
    it('should evaluate isBeforeDate correctly', () => {
      expect(math.evaluate("isBeforeDate('2020-12-20', '2020-12-31')")).toEqual(
        true
      )

      expect(math.evaluate("isBeforeDate('2021-12-20', '2020-12-31')")).toEqual(
        false
      )
    })

    it('should evaluate isAfterDate correctly', () => {
      expect(math.evaluate("isAfterDate('2020-12-20', '2020-12-31')")).toEqual(
        false
      )

      expect(math.evaluate("isAfterDate('2021-12-20', '2020-12-31')")).toEqual(
        true
      )
    })

    it('should evaluate isSameOrBeforeDate correctly', () => {
      expect(
        math.evaluate("isSameOrBeforeDate('2020-12-20', '2020-12-31')")
      ).toEqual(true)

      expect(
        math.evaluate("isSameOrBeforeDate('2020-12-31', '2020-12-31')")
      ).toEqual(true)

      expect(
        math.evaluate("isSameOrBeforeDate('2021-12-31', '2020-12-31')")
      ).toEqual(false)
    })

    it('should evaluate isSameOrAfterDate correctly', () => {
      expect(
        math.evaluate("isSameOrAfterDate('2020-12-20', '2020-12-31')")
      ).toEqual(false)

      expect(
        math.evaluate("isSameOrAfterDate('2020-12-31', '2020-12-31')")
      ).toEqual(true)

      expect(
        math.evaluate("isSameOrAfterDate('2021-12-31', '2020-12-31')")
      ).toEqual(true)
    })

    it('should evaluate isSameDate correctly', () => {
      expect(math.evaluate("isSameDate('2020-12-20', '2020-12-31')")).toEqual(
        false
      )

      expect(math.evaluate("isSameDate('2020-12-31', '2020-12-31')")).toEqual(
        true
      )
    })
  })
})
