import DataTransfer, { DataTransferPayload } from './DataTransfer'

describe('DataTransfer', () => {
  let data

  beforeEach(() => {
    data = null
  })

  it('should have default action insert', () => {
    data = new DataTransfer().action
    expect(data).toEqual('insert')
  })

  it('should accept custom action', () => {
    data = new DataTransfer(undefined, 'test-action').action
    expect(data).toEqual('test-action')
  })

  describe('DataTransfer data getter', () => {
    it('should return stringified JSON', () => {
      data = new DataTransfer('test-value').data
      expect(typeof data).toEqual('string')
    })

    it('should return value in JSON', () => {
      data = JSON.parse(new DataTransfer('test-value').data)
      expect(data.value).toEqual('test-value')
    })
  })

  describe('DataTransfer parseData', () => {
    it('should return DataTransferPayload', () => {
      const dataStr = JSON.stringify({ a: 1, b: 2 })
      data = DataTransfer.parseData(dataStr)
      expect(data instanceof DataTransferPayload).toBeTruthy()
    })

    it('should return undefined if JSON.parse fails', () => {
      data = DataTransfer.parseData(null)
      expect(data).toEqual(undefined)
    })
  })
})
