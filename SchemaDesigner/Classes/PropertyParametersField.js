import _ from 'lodash'

export default class PropertyParametersField {
  key = null
  type = null
  label = null

  constructor(data) {
    _.keys(data).forEach(key => {
      this[key] = data[key]
    })
    this.label = _.startCase(this.label)
  }

  get isBooleanType() {
    return this.type === 'boolean'
  }

  get isObjectType() {
    return this.type === 'object'
  }

  get isTextType() {
    return this.type === 'string'
  }
}
