import Parts from './Parts'

describe('Parts', () => {
  let data
  let parts

  beforeEach(() => {
    parts = null
    data = [
      {
        name: 'index',
        fileName: 'index.json',
        isMain: true,
        structure: {
          key: 'a-node',
          properties: {
            general: {
              $ref: 'general.json',
            },
          },
        },
      },
      {
        name: 'general',
        fileName: 'general.json',
        isMain: false,
        structure: {
          key: 'b-node',
          properties: {
            attachments: {
              $ref: 'attachments.json',
            },
          },
        },
      },
      {
        name: 'attachments',
        fileName: 'attachments.json',
        isMain: false,
        structure: { key: 'c-node', properties: {} },
      },
    ]
  })

  it('should have nodeParts', () => {
    parts = new Parts(data)
    expect(parts.nodeParts.index.key).toEqual('a-node')
    expect(parts.nodeParts.general.key).toEqual('b-node')
  })

  it('should have index', () => {
    parts = new Parts(data)
    expect(parts.index.key).toEqual('a-node')
  })

  it('should connect $ref contents to index properties', () => {
    parts = new Parts(data)
    parts.buildIndex()
    expect(parts.index.properties.general.key).toEqual('b-node')
  })

  it('should connect $ref contents to index properties recursively', () => {
    parts = new Parts(data)
    parts.buildIndex()
    expect(parts.index.properties.general.properties.attachments.key).toEqual(
      'c-node'
    )
  })

  describe('payload getter', () => {
    it('should have correct number of parts', () => {
      parts = new Parts(data)
      parts.buildIndex()

      expect(parts.payload.length).toEqual(3)
    })

    it('should have correct $ref values', () => {
      parts = new Parts(data)
      parts.buildIndex()

      const { structure } = parts.payload[0]

      expect(structure.key).toEqual('a-node')
      expect(structure.properties.general.$ref).toEqual('general.json')
    })
  })

  it('should accept index data', () => {
    parts = new Parts(data)
    parts.buildIndex()
    const demoParts = new Parts(data, undefined, parts.index)
    expect(
      demoParts.index.properties.general.properties.attachments.key
    ).toEqual('c-node')
  })
})
