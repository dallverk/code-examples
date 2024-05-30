import SchemaTreeNode from './SchemaTreeNode'
import UiOptions from './UiOptions'
import PropertyParametersField from './PropertyParametersField'

describe('SchemaTreeNode', () => {
  let node

  beforeEach(() => {
    node = null
  })

  it('should change uiType quote to uiType root', () => {
    node = new SchemaTreeNode({ uiType: 'quote' })
    expect(node.uiType).toEqual('root')
  })

  it('should assign uiType from value if none assigned', () => {
    node = new SchemaTreeNode({ value: 'text' })
    expect(node.uiType).toEqual('text')
  })

  it('should always null value', () => {
    node = new SchemaTreeNode({ value: 'test' })
    expect(node.value).toEqual(null)
  })

  describe('SchemaTreeNode label', () => {
    it('should assign label from data', () => {
      node = new SchemaTreeNode({ label: 'test' })
      expect(node.label).toEqual('test')
    })

    it('should assign start case label from uiType if data is has none', () => {
      node = new SchemaTreeNode({ label: null, uiType: 'text' })
      expect(node.label).toEqual('Text')
    })
  })

  describe('SchemaTreeNode uiOptions', () => {
    it('should be instance of UiOptions class', () => {
      node = new SchemaTreeNode({})
      expect(node.uiOptions).toBeInstanceOf(UiOptions)
    })
  })

  describe('uiOptionsKeys', () => {
    it('should return empty array if node is root', () => {
      node = new SchemaTreeNode({ uiType: 'root' })
      expect(node.uiOptionsKeys).toEqual([])
    })
  })

  describe('editableKeys', () => {
    it('should return empty array if node is root', () => {
      node = new SchemaTreeNode({ uiType: 'root' })
      expect(node.editableKeys).toEqual([])
    })

    it('should return array of PropertyParametersField', () => {
      node = new SchemaTreeNode({ uiType: 'section' })
      node.editableKeys.forEach(item => {
        expect(item).toBeInstanceOf(PropertyParametersField)
      })
    })

    it("should return array with 'options' key of 'object' type", () => {
      node = new SchemaTreeNode({ uiType: 'select' })

      expect(node.editableKeys).toContainEqual({
        key: 'options',
        label: 'Options',
        type: 'object',
      })
    })
  })

  describe('uiPropertiesKeys', () => {
    it('should return 1 item array', () => {
      node = new SchemaTreeNode({ uiProperties: {} })

      expect(node.uiPropertiesKeys).toContainEqual({
        key: 'uiProperties',
        label: 'Ui Properties',
        type: 'object',
      })
    })
  })

  describe('prepareOptions', () => {
    it('should return object array if argument array has primitive types', () => {
      node = new SchemaTreeNode({
        options: ['one', 'two'],
      })

      expect(node.options).toContainEqual({
        label: 'one',
        value: 'one',
      })

      expect(node.options).toHaveLength(2)
    })

    it('should return object array if argument array has object types', () => {
      node = new SchemaTreeNode({
        options: [
          { value: 'uno', label: 'uno' },
          { value: 'dos', label: 'dos' },
        ],
      })

      expect(node.options).toContainEqual(
        {
          label: 'uno',
          value: 'uno',
        },
        {
          label: 'dos',
          value: 'dos',
        }
      )

      expect(node.options).toHaveLength(2)
    })
  })
})
