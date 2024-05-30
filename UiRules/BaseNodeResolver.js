export default class BaseNodeResolver {
  constructor(baseNode) {
    this.baseNode = baseNode
  }

  static SECTION_TABLE_KEY() {
    return 'sectionTableRows'
  }

  static TRIGGER_ONLOAD() {
    return 'onLoad'
  }

  static JOINT_NODE() {
    return 'properties'
  }

  static TARGET_NOT_FOUND_ERROR(nodeName = 'node') {
    return new Error(`Target ${nodeName} is not found`)
  }

  getValueByRuleOrSource(rule) {
    if (rule.source) {
      return this.getValueFromRuleSource(rule.source)
    }

    return this.getRuleValue(rule)
  }

  getValueFromRuleSource(source) {
    if (_.isArray(source)) {
      return _.map(source, (item) => {
        return this.getValue(item)
      })
    }

    return this.getValue(source)
  }

  getRuleValue(rule) {
    let value = rule.value

    if (typeof value === 'object' && value !== null) {
      if (_.isArray(value)) {
        return value
      }

      if (!value.value) {
        return null
      }

      value = value.value
    }

    return value
  }

  getValue(key) {
    let value = _.get(
      this.baseNode,
      `properties.${this.getPathToNode(key)}.value`
    )

    if (
      value !== null &&
      typeof value === 'object' &&
      value.hasOwnProperty('value')
    ) {
      value = value.value
    }

    return value
  }

  getUiOptions(key) {
    return _.get(
      this.baseNode,
      `properties.${this.getPathToNode(key)}.uiOptions`,
      {}
    )
  }

  insertTableSectionToPath(path = '', separator = '.') {
    return path
      .split(separator)
      .reduce((acc, current) => {
        acc.push(BaseNodeResolver.JOINT_NODE(), current)
        const baseNode = _.get(this.baseNode, acc)
        if (!baseNode) {
          return acc
        }
        if (baseNode.uiType === 'tableSection') {
          acc.push(BaseNodeResolver.SECTION_TABLE_KEY())
        }
        return acc
      }, [])
      .filter((item) => item !== BaseNodeResolver.JOINT_NODE())
      .join(separator)
  }

  getPathToNode(property) {
    /**
     * Assume to get raw path as an argument and prepare it for tableSection
     */
    let path = this.parseTableSectionUiRuleParam(property)
    if (!_.isString(path)) {
      return property
    }

    if (!path.match(new RegExp(BaseNodeResolver.SECTION_TABLE_KEY()))) {
      path = this.insertTableSectionToPath(path)
    }

    if (path.match(new RegExp(BaseNodeResolver.SECTION_TABLE_KEY()))) {
      return path
        .split(`.${BaseNodeResolver.SECTION_TABLE_KEY()}`)
        .map((item, index) => {
          if (index === 0) {
            return item
              .replace(/\./g, '.properties.')
              .replace(/_/g, '.')
              .replace('properties.rows', 'rows')
              .concat(`.${BaseNodeResolver.SECTION_TABLE_KEY()}`)
          }
          return item
        })
        .join('')
        .replace(/\.node$/, '')
        .concat('.node')
    }

    if (path.match(/{\d}/)) {
      try {
        const index = _.first(_.first(property.match(/{\d}/)).match(/\d/))

        const multipleSectionNode =
          this.baseNode.properties[
            _.first(property.split(/\.{\d}\./)).replace('.', '.properties.')
          ]
        const multipleSectionNodeRowKey = Object.keys(multipleSectionNode.rows)[
          index
        ]
        path = property.replace(/{\d}\./, `rows_${multipleSectionNodeRowKey}_`)
      } catch (error) {
        console.error(error)
      }
    }

    return path
      .replace(/\./g, '.properties.') // Replace all dots to properties, to suit the node structure.
      .replace(/_/g, '.') // Underscores are inserted if properties should not be inserted.
      .replace('properties.rows', 'rows') // Properties are never needed next to rows.
  }

  parseTableSectionUiRuleParam(param = '') {
    /**
     * @todo Do you really need '.node' in the path?
     */
    const regExp = new RegExp(/\.column\./i)
    if (!_.isString(param) || !param.match(regExp)) {
      return param
    }
    const newPath = param
      .replace(regExp, `.${BaseNodeResolver.SECTION_TABLE_KEY()}.`)
      .concat('.node')
    return newPath
  }

  setVisibility(target, state) {
    if (_.isArray(target)) {
      target.forEach((item) => {
        this.setVisibilityByTarget(item, state)
      })
      return
    }

    this.setVisibilityByTarget(target, state)
  }

  setVisibilityByTarget(target, state) {
    if (_.get(this.baseNode, `properties.${this.getPathToNode(target)}`)) {
      _.set(
        this.baseNode,
        `properties.${this.getPathToNode(target)}.uiOptions.visible`,
        state
      )
    }
  }

  setValueToNode(target, value, trigger) {
    if (_.isArray(target)) {
      target.forEach((item) => {
        this.setValueToNodeByTarget(item, value, trigger)
      })
      return
    }

    this.setValueToNodeByTarget(target, value, trigger)
  }

  setValueToNodeByTarget(target, value, trigger) {
    const formattedPath = `properties.${this.getPathToNode(target)}`
    const targetNode = _.get(this.baseNode, formattedPath)

    if (_.isUndefined(targetNode)) {
      throw BaseNodeResolver.TARGET_NOT_FOUND_ERROR(formattedPath)
    }

    const currentValue = targetNode.value

    const triggerName = _.isObject(trigger) ? trigger.name : trigger
    const force = _.isObject(trigger) ? trigger.force : false

    if (
      currentValue !== null &&
      currentValue !== '' &&
      triggerName === BaseNodeResolver.TRIGGER_ONLOAD() &&
      !force
    ) {
      return
    }

    _.set(
      this.baseNode,
      `properties.${this.getPathToNode(target)}.value`,
      value
    )
  }

  getValueBySourceOrParameters(rule) {
    if (rule.source) {
      return this.getValueFromRuleSource(rule.source)
    }

    return rule.parameters
  }

  parseParameters(parameters) {
    if (typeof parameters === 'string') {
      return parameters.split(',')
    }

    if (typeof parameters === 'number') {
      return [parameters]
    }

    if (typeof parameters === 'boolean') {
      return [parameters ? '1' : '0']
    }

    if (!parameters) {
      return []
    }

    return parameters
  }

  setVisibilityByParameters(
    rule,
    value,
    shouldInclude = true,
    valueKey = 'value'
  ) {
    const parameters = this.parseParameters(rule.parameters)
    let visibility

    if (_.isArray(value)) {
      visibility = value.some((item) => {
        if (_.isObject(item) && item[valueKey]) {
          return parameters.includes(item[valueKey])
        }
        return parameters.includes(item)
      })
    } else {
      visibility = parameters.includes(`${value}`)
    }

    if (visibility) {
      this.setVisibility(rule.target, !shouldInclude)
    } else {
      this.setVisibility(rule.target, shouldInclude)
    }
  }

  getMultipleSourceValue(sources) {
    if (_.isArray(sources)) {
      return sources.map((item) => this.getValueFromRuleSource(item))
    }
    return []
  }
}
