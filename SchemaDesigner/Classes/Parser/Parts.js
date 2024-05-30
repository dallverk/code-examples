import _ from 'lodash'
import SchemaPartModel from '@/Modules/Schema/SchemaPart/SchemaPartModel'

export class SchemaPart extends SchemaPartModel {
  constructor(data = {}, cleanUp) {
    super(data)
    cleanUp && this.cleanUp()
  }

  cleanUp() {
    if (this.structure) {
      delete this.structure.$ref
    }
  }
}

export default class Parts {
  constructor(parts, refKey = '$ref', index) {
    this.parts = parts.map(item => new SchemaPart(item))
    this.mainKey = this.parts.find(item => item.isMain).name
    this.$ref = refKey
    this.nodeParts = this.reducePartStructure()

    if (!index) {
      this.index = this.nodeParts[this.mainKey]
      return
    }

    this.index = index
  }

  get payload() {
    const parts = []

    this.parts.forEach(part => {
      let node

      if (part.isMain) {
        node = _.cloneDeep(this.index)
        this.updateNodeRefs(node)
        const newPart = new SchemaPart({ ...part, structure: node }, true)
        parts.push(newPart)
        return
      }

      node = this.findRef(part.fileName)

      if (!node) {
        return
      }

      node = _.cloneDeep(node)
      this.updateNodeRefs(node)
      const newPart = new SchemaPart({ ...part, structure: node }, true)
      parts.push(newPart)
    })

    return parts
  }

  updateNodeRefs(node) {
    if (
      Object.prototype.hasOwnProperty.call(node, 'properties') &&
      Object.keys(node.properties).length
    ) {
      for (let property in node.properties) {
        if (node.properties[property][this.$ref]) {
          node.properties[property] = {
            [this.$ref]: node.properties[property][this.$ref],
          }
          return
        }

        this.updateNodeRefs(node.properties[property])
      }
    }
  }

  reducePartStructure() {
    return this.parts.reduce((acc, part) => {
      acc[part.name] = part.structure
      return acc
    }, {})
  }

  buildIndex(node = this.index) {
    if (
      Object.prototype.hasOwnProperty.call(node, 'properties') &&
      Object.keys(node.properties).length
    ) {
      for (let property in node.properties) {
        const nodeProperty = node.properties[property]
        if (nodeProperty[this.$ref]) {
          const partialNode = this.findNodeByFileName(nodeProperty[this.$ref])

          if (!partialNode) {
            this.buildIndex(node.properties[property])
            return
          }

          node.properties[property] = {
            ...partialNode.structure,
            [this.$ref]: nodeProperty[this.$ref],
          }
        }
        this.buildIndex(node.properties[property])
      }
    }
  }

  *postOrderTraversal(node) {
    if (
      Object.prototype.hasOwnProperty.call(node, 'properties') &&
      Object.keys(node.properties).length
    ) {
      for (let key in node.properties) {
        yield* this.postOrderTraversal(node.properties[key])
      }
    }
    yield node
  }

  findNodeByFileName(key) {
    let nodes = []

    this.parts.forEach(element => {
      for (let node of this.postOrderTraversal(element)) {
        if (node.fileName === key) {
          nodes.push(node)
          return
        }
      }
    })

    if (!nodes.length) {
      return false
    }

    return _.first(nodes)
  }

  findRef(key) {
    for (let node of this.postOrderTraversal(this.index)) {
      if (node.$ref === key) {
        return node
      }
    }
  }
}
