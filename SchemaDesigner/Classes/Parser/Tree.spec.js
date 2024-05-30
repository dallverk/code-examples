import Tree from './Tree'

describe('Tree', () => {
  let tree
  let node

  beforeEach(() => {
    tree = null
    node = null
  })

  it('should have a root', () => {
    tree = new Tree({})
    expect(tree.root).toBeTruthy()
  })

  it('should have a Node propery', () => {
    function CustomNode() {}
    tree = new Tree({}, CustomNode)
    expect(tree.root instanceof CustomNode).toBeTruthy()
  })

  it('should build a tree with array properties', () => {
    tree = new Tree({
      properties: {
        a: {},
      },
    })
    expect(tree.root.properties.length).toEqual(1)
  })

  it('should set objectKey for node', () => {
    tree = new Tree({
      properties: {
        a: {},
      },
    })
    expect(tree.root.properties[0].objectKey).toEqual('a')
  })

  it('should set objectKey for nested nodes', () => {
    tree = new Tree({
      properties: {
        a: {
          properties: {
            aa: {},
          },
        },
      },
    })
    expect(tree.root.properties[0].properties[0].objectKey).toEqual('aa')
  })

  it('should set correct node depth', () => {
    tree = new Tree({
      properties: {
        a: {
          properties: {
            aa: {},
          },
        },
      },
    })
    expect(tree.root.properties[0].properties[0].depth).toEqual(2)
  })

  describe('Tree objectify', () => {
    it('should return node', () => {
      tree = new Tree({})
      const node = tree.objectify()
      expect(node).toBeTruthy()
    })

    it('should covert array properties to object', () => {
      tree = new Tree({})
      node = {
        properties: [
          {
            key: 1,
          },
          {
            key: 2,
          },
        ],
      }
      const result = tree.objectify(node)
      expect(Object.keys(result.properties).length).toEqual(2)
    })

    it('should use object key as property key', () => {
      tree = new Tree({})
      node = {
        properties: [
          {
            objectKey: 'node1',
          },
        ],
      }
      const result = tree.objectify(node)
      expect(Object.keys(result.properties)[0]).toEqual('node1')
    })

    it('should create string object key for property key is one is undefined', () => {
      tree = new Tree({})
      node = {
        properties: [
          {
            objectKey: undefined,
          },
        ],
      }
      const result = tree.objectify(node)
      expect(typeof Object.keys(result.properties)[0]).toEqual('string')
      expect(Object.keys(result.properties)[0].length > 0).toBeTruthy()
    })

    it('should convert properties recursivelly', () => {
      tree = new Tree({})
      node = {
        properties: [
          {
            objectKey: 'a',
            properties: [
              {
                objectKey: 'aa',
                value: 'test',
              },
            ],
          },
        ],
      }
      const result = tree.objectify(node)
      expect(result.properties.a.properties.aa.value).toEqual('test')
    })
  })

  describe('Tree find', () => {
    it('should return node by key', () => {
      tree = new Tree({
        properties: {
          a: {
            key: 'a-test',
          },
        },
      })
      node = tree.find('a-test')
      expect(node.key).toEqual('a-test')
    })

    it('should return nested property node by key', () => {
      tree = new Tree({
        properties: {
          a: {
            properties: {
              aa: {
                key: 'aa-test',
              },
            },
          },
        },
      })
      node = tree.find('aa-test')
      expect(node.key).toEqual('aa-test')
    })

    it('should return undefined if not found', () => {
      tree = new Tree({})
      node = tree.find('a-test')
      expect(node).toEqual(undefined)
    })
  })

  describe('Tree insert', () => {
    it('should insert node by parent key', () => {
      tree = new Tree({
        key: 'root',
      })
      tree.insert('root', 'a')
      expect(tree.root.properties[0]).toBeTruthy()
    })

    it('should insert node by parent key with value', () => {
      tree = new Tree({
        key: 'root',
      })
      tree.insert('root', 'a', 'test-value')
      expect(tree.root.properties[0].value).toEqual('test-value')
    })

    it('should insert node by parent key at index', () => {
      tree = new Tree({
        key: 'root',
      })
      tree.insert('root', 'a', 'test-value-A', 1)
      tree.insert('root', 'a', 'test-value-B', 0)
      expect(tree.root.properties[1].value).toEqual('test-value-A')
      expect(tree.root.properties[0].value).toEqual('test-value-B')
    })

    it('should return false if failed', () => {
      tree = new Tree({})
      const result = tree.insert('a', 'aa')
      expect(result).toEqual(false)
    })

    it('should insert node with correct depth', () => {
      tree = new Tree({
        key: 'root',
      })
      tree.insert('root', 'a')
      expect(tree.root.properties[0].depth).toEqual(1)
    })
  })

  describe('Tree remove', () => {
    it('should remove node by parent key', () => {
      tree = new Tree({
        key: 'root',
        properties: {
          a: {
            key: 'a-test',
          },
        },
      })
      tree.remove('root', 'a-test')
      expect(tree.root.properties.length).toEqual(0)
    })
  })

  describe('Tree copy', () => {
    let tree

    beforeEach(() => {
      tree = new Tree({
        key: 'root',
        properties: {
          a: {
            key: 'a-test',
            properties: {
              a: {
                key: 'aa-test',
                value: 'aa-test-val',
              },
            },
          },
        },
      })
    })

    it('should copy node by key', () => {
      tree.copy('a-test')
      expect(tree.root.properties.length).toEqual(2)
    })

    it('should copy node by key with newKey', () => {
      tree.copy('a-test', 'b-test')
      expect(tree.root.properties[1].key).toEqual('b-test')
    })

    it('should copy node by key with properties', () => {
      tree.copy('a-test')
      expect(tree.root.properties[1].properties.length).toEqual(1)
    })

    it('should return false if key not found', () => {
      const result = tree.copy('root-a')
      expect(result).toEqual(false)
    })

    it('should return false if node parent not found', () => {
      tree.root.properties[0].parent = null
      const result = tree.copy('a-test')
      expect(result).toEqual(false)
    })
  })

  describe('Tree move', () => {
    let tree
    beforeEach(() => {
      tree = new Tree({
        key: 'root',
        properties: {
          a: {
            key: 'a-test',
            properties: {
              a: {
                key: 'aa-test',
                value: 'aa-test-val',
              },
            },
          },
          b: {
            key: 'b-test',
            properties: {
              a: {
                key: 'ba-test',
                value: 'ba-test-val',
              },
            },
          },
        },
      })
    })

    it('should return false if node is same as target', () => {
      const res = tree.move('a-test', 'a-test')
      expect(res).toEqual(false)
    })

    it('should return false if parent node does not exist', () => {
      const res = tree.move('root', 'a-test')
      expect(res).toEqual(false)
    })

    it('should return false if target not found', () => {
      const res = tree.move('a-test', 'not-found-test')
      expect(res).toEqual(false)
    })

    it('should move node by key', () => {
      tree.move('ba-test', 'a-test')
      expect(tree.root.properties[0].properties.length).toEqual(2)
      expect(tree.root.properties[1].properties.length).toEqual(0)
    })

    it('should move node by key with index', () => {
      tree.move('ba-test', 'a-test', 0)
      expect(tree.root.properties[0].properties[0].value).toEqual('ba-test-val')
      expect(tree.root.properties[0].properties[1].value).toEqual('aa-test-val')
    })

    it('should move node by key with properties', () => {
      tree.move('b-test', 'root', 0)
      expect(tree.root.properties.length).toEqual(2)
      expect(tree.root.properties[0].properties[0].value).toEqual('ba-test-val')
    })

    it('should return false if key not found', () => {
      const res = tree.move('bca-test', 'a-test')
      expect(res).toEqual(false)
    })

    it('should return false if node parent is target node but no index provided', () => {
      const res = tree.move('a-test', 'root')
      expect(res).toEqual(false)
    })
  })
})
