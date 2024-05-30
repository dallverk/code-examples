import _ from 'lodash'
import TreeNode from './TreeNode'

export default class Tree {
  root = null
  #Node = TreeNode

  constructor(data, Node) {
    if (Node) {
      this.#Node = Node
    }
    this.root = new this.#Node(data)
    this.buildTree()
  }

  objectify(node = _.cloneDeep(this.root)) {
    if (
      Object.prototype.hasOwnProperty.call(node, 'properties') &&
      node.properties.length
    ) {
      node.properties = node.properties.reduce((acc, node, index) => {
        const key = node.objectKey
          ? node.objectKey
          : this.#Node.buildObjectKey(node.key, index)
        acc[key] = new this.#Node({ ...node, parent: null })
        return acc
      }, {})
      for (let property in node.properties) {
        this.objectify(node.properties[property])
      }
    }
    return node
  }

  buildTree(node = this.root, depth = 0) {
    if (
      Object.prototype.hasOwnProperty.call(node, 'properties') &&
      node.properties.length
    ) {
      depth += 1
      node.properties = node.properties.map(
        item => new this.#Node({ ...item, parent: node.key, depth })
      )
      for (let property of node.properties) {
        this.buildTree(property, depth)
      }
    }
  }

  buildDepth(node, depth) {
    if (
      Object.prototype.hasOwnProperty.call(node, 'properties') &&
      node.properties.length
    ) {
      depth += 1
      node.properties.forEach(item => {
        item.depth = depth
      })
      for (let property of node.properties) {
        this.buildDepth(property, depth)
      }
    }
  }

  buildBranch(node) {
    if (
      Object.prototype.hasOwnProperty.call(node, 'properties') &&
      node.properties.length
    ) {
      node.properties = node.properties.map(
        item => new this.#Node({ ...item, parent: node.key, key: null })
      )
      for (let property of node.properties) {
        this.buildBranch(property)
      }
    }
  }

  *postOrderTraversal(node = this.root) {
    if (
      Object.prototype.hasOwnProperty.call(node, 'properties') &&
      node.properties.length
    ) {
      for (let property of node.properties) {
        yield* this.postOrderTraversal(property)
      }
    }
    yield node
  }

  find(key) {
    for (let node of this.postOrderTraversal()) {
      if (node.key === key) return node
    }
    return undefined
  }

  insert(parentNodeKey, key, value, index) {
    for (let node of this.postOrderTraversal()) {
      if (node.key === parentNodeKey) {
        const newNode = new this.#Node({
          key,
          parent: node.key,
          value,
          depth: node.depth + 1,
        })

        if (isNaN(index)) {
          node.properties.push(newNode)
          return true
        }

        node.properties.splice(index, 0, newNode)
        return true
      }
    }
    return false
  }

  remove(parentNodeKey, key) {
    for (let node of this.postOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.properties = node.properties.filter(item => item.key !== key)
      }
    }
  }

  copy(key, newKey) {
    let parentNode
    let sourceNode

    sourceNode = this.find(key)

    if (!sourceNode) {
      return false
    }

    parentNode = this.find(sourceNode.parent)

    if (!parentNode) {
      return false
    }

    const index = parentNode.properties.findIndex(item => item.key === key)

    const node = parentNode.properties.find(item => item.key === key)

    const nodeCopy = new this.#Node({ ...node, key: newKey })

    this.buildBranch(nodeCopy)

    parentNode.properties.splice(index + 1, 0, nodeCopy)

    return true
  }

  move(key, targetParentNodeKey, index) {
    if (key === targetParentNodeKey) {
      return false
    }

    let parentNode
    let targetNode
    let sourceNode

    sourceNode = this.find(key)

    if (!sourceNode) {
      return false
    }

    parentNode = this.find(sourceNode.parent)

    if (!parentNode) {
      return false
    }

    if (parentNode.key === targetParentNodeKey && isNaN(index)) {
      return false
    }

    targetNode = parentNode.key === targetParentNodeKey ? parentNode : undefined

    if (!targetNode) {
      targetNode = this.find(targetParentNodeKey)
    }

    if (!targetNode) {
      return false
    }

    const newNode = new this.#Node({
      ...sourceNode,
      parent: targetNode.key,
      key,
      depth: targetNode.depth + 1,
    })

    this.buildDepth(newNode, targetNode.depth + 1)

    parentNode.properties = parentNode.properties.filter(
      item => item.key !== key
    )

    if (isNaN(index)) {
      targetNode.properties.push(newNode)
      return true
    }

    targetNode.properties.splice(index, 0, newNode)

    return true
  }
}
