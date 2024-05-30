import _ from 'lodash'
import { UiOptionsMap } from '@/Modules/Schema/SchemaDesigner/Classes/UiOptions'

export default class SchemaPartNode {
  constructor(data) {
    this.uiType = data.uiType
    this.label = data.label
    this.description = data.description
    this.uiProperties = data.uiProperties
    this.default = data.default
    this.$ref = data.$ref

    if (_.isArray(data.options)) {
      this.options = this.prepareOptions(data.options)
    }

    if (_.isObject(data.properties) && _.keys(data.properties).length) {
      this.properties = data.properties
    }

    if (data.uiOptions) {
      const uiOptionsPayload = this.getUiOptionsPayload(data.uiOptions)

      this.uiOptions = {}
      _.keys(uiOptionsPayload).forEach((key) => {
        if (data.uiOptions[key] !== '' && data.uiOptions[key] !== null) {
          this.uiOptions[key] = data.uiOptions[key]
        }
      })
    }
  }

  static getSchemaPartsPayload(root) {
    let payload = {}
    const schemaPartNode = this.traverseTree(
      new SchemaPartNode(_.cloneDeep(root))
    )
    schemaPartNode.uiType = 'quote'
    schemaPartNode.version = root.version
    schemaPartNode.apiIntegrations = root.apiIntegrations
    payload.index = schemaPartNode
    return payload
  }

  getUiOptionsPayload(data) {
    return _.keys(data)
      .filter((key) => {
        if (UiOptionsMap[key]) {
          return UiOptionsMap[key].includes(this.uiType)
        }
        return true
      })
      .reduce((acc, key) => {
        acc[key] = data[key]
        return acc
      }, {})
  }

  static traverseTree(node) {
    if (_.keys(node.properties).length) {
      for (let property in node.properties) {
        node.properties[property] = new SchemaPartNode(
          node.properties[property]
        )
        SchemaPartNode.traverseTree(node.properties[property])
      }
    }
    return node
  }

  prepareOptions(value) {
    if (_.isArray(value)) {
      return value
        .map((item) => {
          if (_.isObject(item)) {
            return item.value
          }
          return item
        })
        .filter((item) => !!item)
    }
    return []
  }
}
