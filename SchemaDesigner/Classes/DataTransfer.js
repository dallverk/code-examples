export const DataTransferAction = Object.freeze({
  move: 'move',
  insert: 'insert',
})

export class DataTransferPayload {
  constructor(action, value) {
    this.action = action
    this.value = value
  }
}

export default class DataTransfer {
  constructor(value, action = DataTransferAction.insert) {
    this.action = action
    this.value = value
  }

  get data() {
    const data = new DataTransferPayload(this.action, this.value)
    return JSON.stringify(data)
  }

  static parseData(data) {
    try {
      const { action, value } = JSON.parse(data)
      return new DataTransferPayload(action, value)
    } catch (error) {
      console.error(error)
    }
  }
}
