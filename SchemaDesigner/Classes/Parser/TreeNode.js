import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

export default class TreeNode {
  /**
   * key should be unique
   */
  key = null
  /**
   * node type, potentialy ui type
   */
  value = null
  properties = []
  /**
   * Could be reference but Vue and json has issues to handle recurring depenencies
   * Using parent key atm
   */
  parent = null
  /**
   * For generating object like structure from properties array
   */
  objectKey
  depth = 0

  constructor(data) {
    _.keys(data).forEach(key => {
      this[key] = data[key]
    })
    if (!this.key) {
      this.key = TreeNode.buildKey()
    }

    if (_.isObject(this.properties) && !_.isArray(this.properties)) {
      this.properties = _.keys(this.properties).map(key => ({
        ...this.properties[key],
        objectKey: key,
      }))
    }
  }

  static buildKey() {
    return uuidv4()
  }

  static buildObjectKey(key = TreeNode.buildKey(), index = 0) {
    return `${key}.${index}`
  }
}
