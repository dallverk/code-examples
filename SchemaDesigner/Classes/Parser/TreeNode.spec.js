import TreeNode from './TreeNode'

describe('TreeNode', () => {
  let node

  beforeEach(() => {
    node = null
  })

  it('should have a generated key if none provided', () => {
    node = new TreeNode({})
    expect(node.key.length > 0).toBeTruthy()
  })

  it('should have a key', () => {
    node = new TreeNode({ key: '1' })
    expect(node.key).toEqual('1')
  })

  it('should have array type properties', () => {
    node = new TreeNode()
    expect(node.properties).toEqual([])
  })

  it('should convert properties object to array properties', () => {
    node = new TreeNode({ properties: {} })
    expect(node.properties).toEqual([])
  })

  it('should assign properties object key to node array properties', () => {
    node = new TreeNode({ properties: { prop: {} } })
    expect(node.properties).toEqual([{ objectKey: 'prop' }])
  })

  describe('TreeNode buildKey', () => {
    it('should return random string', () => {
      const key = TreeNode.buildKey()
      expect(typeof key).toEqual('string')
    })
  })

  describe('TreeNode buildObjectKey', () => {
    it('should use default arguments', () => {
      const key = TreeNode.buildObjectKey()
      expect(key.length > 0).toBeTruthy()
    })

    it('should concat key and index arguments with dot', () => {
      const key = TreeNode.buildObjectKey('1', 0)
      expect(key).toEqual('1.0')
    })
  })
})
