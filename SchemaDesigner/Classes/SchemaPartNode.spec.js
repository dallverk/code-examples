import SchemaPartNode from './SchemaPartNode'

describe('SchemaPartNode', () => {
  let node

  beforeEach(() => {
    node = null
  })

  it('should have options ar array of primitives', () => {
    node = new SchemaPartNode({
      options: [{ value: 'quote', label: 'quote' }, 'test'],
    })
    expect(node.options).toContainEqual('quote', 'test')
  })

  it('should not set empty properties key', () => {
    node = new SchemaPartNode({})
    expect(node.properties).toEqual(undefined)

    node = new SchemaPartNode({ properties: {} })
    expect(node.properties).toEqual(undefined)

    node = new SchemaPartNode({ properties: { 'node-a': {} } })
    expect(node.properties).toEqual({ 'node-a': {} })
  })

  it('should not set empty uiOptions key', () => {
    node = new SchemaPartNode({})
    expect(node.uiOptions).toEqual(undefined)
  })

  it('should not set null or empty string uiOptions values', () => {
    node = new SchemaPartNode({
      uiOptions: {
        visible: null,
        readonly: '',
      },
    })
    expect(node.uiOptions).toEqual({})

    node.uiOptions.visible = false
    node.uiOptions.readonly = true
    expect(node.uiOptions).toEqual({ visible: false, readonly: true })
  })
})
