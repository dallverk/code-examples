import _ from 'lodash'

export const SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY_GETTER = _.camelCase(
  'SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY_GETTER'
)

export const SCHEMA_DESIGNER_TREE_GETTER = _.camelCase(
  'SCHEMA_DESIGNER_TREE_GETTER'
)

export const SCHEMA_DESIGNER_PROPERTIES_GETTER = _.camelCase(
  'SCHEMA_DESIGNER_TREE_PROPERTIES'
)

export const SET_SCHEMA_DESIGNER_EDITOR_PROPERTIES = _.camelCase(
  'SET_SCHEMA_DESIGNER_EDITOR_PROPERTIES'
)

export const SET_SCHEMA_DESIGNER_TREE = _.camelCase('SET_SCHEMA_DESIGNER_TREE')

export const EDITOR_TREE_PROPERTY_REMOVE = _.camelCase(
  'EDITOR_TREE_PROPERTY_REMOVE'
)

export const EDITOR_PROPERTY_REMOVE = _.camelCase('EDITOR_PROPERTY_REMOVE')

export const SET_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY = _.camelCase(
  'SET_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY'
)

export const TOGGLE_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY = _.camelCase(
  'TOGGLE_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY'
)

export const EDITOR_TREE_PROPERTY_MOVE = _.camelCase(
  'EDITOR_TREE_PROPERTY_MOVE'
)

export const EDITOR_TREE_PROPERTY_INSERT = _.camelCase(
  'EDITOR_TREE_PROPERTY_INSERT'
)

export const EDITOR_TREE_PROPERTY_COPY = _.camelCase(
  'EDITOR_TREE_PROPERTY_COPY'
)

export class EditorTreeActionOptions {
  insertAsSibling = false

  constructor(options = {}) {
    this.insertAsSibling = options.insertAsSibling
  }
}

export const SchemaDesignerModule = {
  namespaced: true,

  state: {
    tree: null,
    properties: {},
    activeProperty: null,
  },

  mutations: {
    [SET_SCHEMA_DESIGNER_TREE]: (state, newValue) => {
      state.tree = newValue
    },

    [SET_SCHEMA_DESIGNER_EDITOR_PROPERTIES]: (state, newValue) => {
      state.properties = newValue
    },

    [EDITOR_TREE_PROPERTY_REMOVE]: (state, key) => {
      const { tree } = state

      if (!key) {
        return false
      }

      const node = tree.find(key)

      if (!node) {
        return false
      }

      const parentNode = tree.find(node.parent)

      if (!parentNode) {
        return false
      }

      tree.remove(parentNode.key, key)
    },

    [SET_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY]: (state, newValue) => {
      state.activeProperty = newValue
    },

    [EDITOR_TREE_PROPERTY_MOVE]: (state, data) => {
      const { node: targetNode, value: key, options } = data
      const { tree } = state

      if (!targetNode) {
        return false
      }

      if (targetNode.canInsertNode && !options?.insertAsSibling) {
        tree.move(key, targetNode.key)
        return
      }

      const parentNode = tree.find(targetNode.parent)

      if (!parentNode) {
        return false
      }

      const index = parentNode.properties.findIndex(
        (prop) => prop.key === targetNode.key
      )
      tree.move(key, parentNode.key, index)
    },

    [EDITOR_TREE_PROPERTY_INSERT]: (state, data) => {
      const { node, value, options } = data
      const { tree } = state

      if (!node) {
        return false
      }

      if (node.canInsertNode && !options?.insertAsSibling) {
        tree.insert(node.key, undefined, value)
        return
      }

      const parentNode = tree.find(node.parent)

      if (!parentNode) {
        return false
      }

      const index = parentNode.properties.findIndex(
        (prop) => prop.key === node.key
      )
      tree.insert(parentNode.key, undefined, value, index + 1)
    },

    [EDITOR_TREE_PROPERTY_COPY]: (state, key) => {
      const { tree } = state

      if (!key) {
        return false
      }

      tree.copy(key)
    },
  },

  actions: {
    [EDITOR_PROPERTY_REMOVE]: ({ commit, state }, key) => {
      commit(EDITOR_TREE_PROPERTY_REMOVE, key)

      if (state.activeProperty?.key === key) {
        commit(SET_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY, null)
      }
    },

    [TOGGLE_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY]: (
      { commit, state },
      key
    ) => {
      const property = state.tree.find(key)
      if (state.activeProperty?.key === key) {
        commit(SET_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY, null)
        return
      }
      commit(SET_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY, property)
    },
  },

  getters: {
    [SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY_GETTER]: (state) => {
      return state.activeProperty
    },

    [SCHEMA_DESIGNER_TREE_GETTER]: (state) => {
      return state.tree
    },

    [SCHEMA_DESIGNER_PROPERTIES_GETTER]: (state) => {
      return state.properties
    },
  },
}
