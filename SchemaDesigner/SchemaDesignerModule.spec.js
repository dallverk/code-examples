import {
  SchemaDesignerModule,
  EDITOR_TREE_PROPERTY_INSERT,
  EDITOR_TREE_PROPERTY_MOVE,
  EDITOR_TREE_PROPERTY_REMOVE,
  EDITOR_TREE_PROPERTY_COPY,
  EditorTreeActionOptions,
} from './SchemaDesignerModule'

describe('SchemaDesignerModule', () => {
  it('should be namespaced', () => {
    expect(SchemaDesignerModule.namespaced).toEqual(true)
  })

  describe('SchemaDesignerModule state', () => {
    it('should have not have tree', () => {
      expect(SchemaDesignerModule.state.tree).toEqual(null)
    })

    it('should have properties', () => {
      expect(SchemaDesignerModule.state.properties).toEqual({})
    })

    it('should have not have activeProperty', () => {
      expect(SchemaDesignerModule.state.activeProperty).toEqual(null)
    })
  })

  describe(`${EDITOR_TREE_PROPERTY_INSERT} mutation`, () => {
    let state
    let data
    let output
    const mutation = SchemaDesignerModule.mutations[EDITOR_TREE_PROPERTY_INSERT]

    beforeEach(() => {
      state = SchemaDesignerModule.state
      data = {
        node: {
          key: 'node-a',
          parent: 'parent-node-a',
        },
        value: 'data-value',
      }
      output = null
    })

    it('should return false if data argument has no node', () => {
      data = {}

      output = mutation(state, data)

      expect(output).toEqual(false)
    })

    it('should call tree.insert if node can have child nodes', () => {
      const insertMock = jest.fn()

      data.node.canInsertNode = true

      state.tree = {
        insert: insertMock,
      }

      mutation(state, data)

      expect(insertMock).toBeCalledWith(data.node.key, undefined, data.value)
    })

    it("should call tree.insert with 'insertAsSibling' option", () => {
      const index = 1
      const parentNode = {
        properties: [{ key: 'node-a' }],
        key: 'parent-node-a',
      }
      const insertMock = jest.fn()
      const findMock = jest.fn(() => parentNode)

      data.node.canInsertNode = true

      state.tree = {
        insert: insertMock,
        find: findMock,
      }

      data.options = new EditorTreeActionOptions({ insertAsSibling: true })

      mutation(state, data)

      expect(insertMock).toBeCalledWith(
        parentNode.key,
        undefined,
        data.value,
        index
      )
    })

    it('should call tree.find and return undefined if parent node not found', () => {
      const findMock = jest.fn(() => undefined)

      state.tree = {
        find: findMock,
      }

      output = mutation(state, data)

      expect(findMock).toBeCalledWith(data.node.parent)
      expect(output).toEqual(false)
    })

    it("should call tree.insert with node's next index in parent properties", () => {
      const index = 1
      const parentNode = {
        properties: [{ key: 'node-a' }],
        key: 'parent-node-a',
      }
      const insertMock = jest.fn()
      const findMock = jest.fn(() => parentNode)

      state.tree = {
        insert: insertMock,
        find: findMock,
      }

      data.options = new EditorTreeActionOptions()

      mutation(state, data)

      expect(insertMock).toBeCalledWith(
        parentNode.key,
        undefined,
        data.value,
        index
      )
    })
  })

  describe(`${EDITOR_TREE_PROPERTY_MOVE} mutation`, () => {
    let state
    let data
    let output
    const mutation = SchemaDesignerModule.mutations[EDITOR_TREE_PROPERTY_MOVE]

    beforeEach(() => {
      state = SchemaDesignerModule.state
      data = {
        node: {
          key: 'node-a',
          parent: 'parent-node-a',
        },
        value: 'node-b',
      }
      output = null
    })

    it('should return false if data argument has no node', () => {
      data = {}

      output = mutation(state, data)

      expect(output).toEqual(false)
    })

    it('should call tree.move if node can have child nodes', () => {
      const moveMock = jest.fn()

      data.node.canInsertNode = true

      state.tree = {
        move: moveMock,
      }

      mutation(state, data)

      expect(moveMock).toBeCalledWith(data.value, data.node.key)
    })

    it('should call tree.find and return undefined if parent node not found', () => {
      const findMock = jest.fn(() => undefined)

      state.tree = {
        find: findMock,
      }

      output = mutation(state, data)

      expect(findMock).toBeCalledWith(data.node.parent)
      expect(output).toEqual(false)
    })

    it("should call tree.move with node's index in parent properties", () => {
      const index = 0
      const parentNode = {
        properties: [{ key: 'node-a' }],
        key: 'parent-node-a',
      }
      const moveMock = jest.fn()
      const findMock = jest.fn(() => parentNode)

      state.tree = {
        move: moveMock,
        find: findMock,
      }

      mutation(state, data)

      expect(moveMock).toBeCalledWith(data.value, parentNode.key, index)
    })
  })

  describe(`${EDITOR_TREE_PROPERTY_REMOVE} mutation`, () => {
    let state
    let data
    let output
    const mutation = SchemaDesignerModule.mutations[EDITOR_TREE_PROPERTY_REMOVE]

    beforeEach(() => {
      state = SchemaDesignerModule.state
      data = {
        node: {
          key: 'node-a',
          parent: 'parent-node-a',
        },
        value: 'node-b',
      }
      output = null
    })

    it('should return false if data in not a key', () => {
      output = mutation(state, undefined)

      expect(output).toEqual(false)
    })

    it('should call tree.find and return false if not found', () => {
      const findMock = jest.fn()

      state.tree = {
        find: findMock,
      }

      output = mutation(state, 'node-a')

      expect(findMock).toBeCalledWith('node-a')
      expect(output).toEqual(false)
    })

    it('should call tree.find x2 and return if parent not found', () => {
      const findMock = jest.fn()

      findMock.mockReturnValueOnce(data.node)

      findMock.mockReturnValueOnce(undefined)

      state.tree = {
        find: findMock,
      }

      output = mutation(state, 'node-a')

      expect(findMock).toBeCalledTimes(2)
      expect(output).toEqual(false)
    })

    it('should call tree.remove with parent and node keys', () => {
      const findMock = jest.fn()

      findMock.mockReturnValueOnce(data.node)

      const parentNode = {
        properties: [{ key: 'node-a' }],
        key: 'parent-node-a',
      }

      findMock.mockReturnValueOnce(parentNode)

      const removeMock = jest.fn()

      state.tree = {
        find: findMock,
        remove: removeMock,
      }

      mutation(state, 'node-a')

      expect(removeMock).toBeCalledWith(parentNode.key, data.node.key)
    })
  })

  describe(`${EDITOR_TREE_PROPERTY_COPY} mutation`, () => {
    let state
    let data
    let output
    const mutation = SchemaDesignerModule.mutations[EDITOR_TREE_PROPERTY_COPY]

    beforeEach(() => {
      state = SchemaDesignerModule.state
      data = {
        node: {
          key: 'node-a',
          parent: 'parent-node-a',
        },
        value: 'node-b',
      }
      output = null
    })

    it('should return false if data in not a key', () => {
      output = mutation(state, undefined)

      expect(output).toEqual(false)
    })

    it('should call tree.copy', () => {
      const copyMock = jest.fn()

      state.tree = {
        copy: copyMock,
      }

      output = mutation(state, 'node-a')

      expect(copyMock).toBeCalledWith('node-a')
    })
  })
})
