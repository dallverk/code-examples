import TreeNode from '@/Modules/Schema/SchemaDesigner/Classes/Parser/TreeNode'
import UiOptions from '@/Modules/Schema/SchemaDesigner/Classes/UiOptions'
import PropertyParametersField from '@/Modules/Schema/SchemaDesigner/Classes/PropertyParametersField'
import _ from 'lodash'
import { UiTypes } from '@/Modules/Schema/SchemaDesigner/Classes/UiTypes'

export const Parameters = Object.freeze({
  label: 'label',
  description: 'description',
  objectKey: 'objectKey',
  uiType: 'uiType',
  options: 'options',
  default: 'default',
})

export default class SchemaTreeNode extends TreeNode {
  constructor(data) {
    super(data)

    this.id = this.key
    this.uiType = data.uiType
    this.dataKey = data.dataKey || ''
    this.description = data.description
    this.uiProperties = data.uiProperties || {}
    this.options = this.prepareOptions(data.options)
    this.default = data.default || ''

    if (this.uiType === UiTypes.quote || this.value === UiTypes.root) {
      this.uiType = UiTypes.root
      this.apiIntegrations = data.apiIntegrations
      this.version = data.version
      return
    }

    if (!this.uiType) {
      this.uiType = this.value
    }

    this.label = this.prepareLabel(data.label)
    this.value = null
    this.uiOptions = this.resolveUiOptions()
  }

  get uiOptionsKeys() {
    if ([UiTypes.root].includes(this.uiType)) {
      return []
    }
    return this.uiOptions.editableOptions
  }

  get editableKeys() {
    if ([UiTypes.root].includes(this.uiType)) {
      return []
    }
    return _.values(Parameters)
      .filter((key) => (key === Parameters.options ? this.hasOptions : true))
      .map(
        (key) =>
          new PropertyParametersField({
            key: key,
            label: key,
            type: typeof this[key],
          })
      )
  }

  get uiPropertiesKeys() {
    if ([UiTypes.root].includes(this.uiType)) {
      return []
    }
    return ['uiProperties'].map(
      (key) =>
        new PropertyParametersField({
          key: key,
          label: key,
          type: typeof this[key],
        })
    )
  }

  get component() {
    switch (this.uiType) {
      case UiTypes.button:
        return 'UiTypeButton'
      case UiTypes.checkboxes:
        return 'UiTypeCheckboxes'
      case UiTypes.section:
        return 'UiTypeSection'
      case UiTypes.root:
        return 'UiTypeRoot'
      case UiTypes.text:
        return 'UiTypeText'
      case UiTypes.select:
        return 'UiTypeSelect'
      case UiTypes.money:
        return 'UiTypeMoney'
      case UiTypes.date:
        return 'UiTypeDate'
      case UiTypes.toggler:
        return 'UiTypeToggler'
      case UiTypes.radios:
        return 'UiTypeRadios'
      case UiTypes.client:
        return 'UiTypeClient'
      case UiTypes.textArea:
        return 'UiTypeTextArea'
      case UiTypes.richTextArea:
        return 'UiTypeRichTextArea'
      case UiTypes.tag:
        return 'UiTypeTag'
      case UiTypes.email:
        return 'UiTypeEmail'
      case UiTypes.link:
        return 'UiTypeLink'
      case UiTypes.integrationButton:
        return 'UiTypeIntegrationButton'
      case UiTypes.moneySelect:
        return 'UiTypeMoneySelect'
      case UiTypes.currency:
        return 'UiTypeCurrency'
      case UiTypes.decimal:
        return 'UiTypeDecimal'
      case UiTypes.user:
        return 'UiTypeUser'
      case UiTypes.entity:
        return 'UiTypeEntity'
      case UiTypes.policyNumber:
        return 'UiTypePolicyNumber'
      case UiTypes.number:
        return 'UiTypeNumber'
      default:
        return 'UiTypeMissing'
    }
  }

  get canInsertNode() {
    return [UiTypes.section, UiTypes.root].includes(this.uiType)
  }

  get defaultLabel() {
    return _.startCase(this.uiType)
  }

  prepareOptions(value) {
    let options = []
    if (_.isArray(value)) {
      options = value
        .filter((item) => !_.isObject(item))
        .map((item) => ({ value: item, label: item }))
      if (!options.length) {
        options = value.filter((item) => _.isObject(item))
      }
    }

    return options
  }

  prepareLabel(value) {
    if (_.isString(value) && value.length) {
      return value
    }
    return _.startCase(this.uiType)
  }

  get hasOptions() {
    return [
      UiTypes.select,
      UiTypes.checkboxes,
      UiTypes.radios,
      UiTypes.tag,
      UiTypes.moneySelect,
    ].includes(this.uiType)
  }

  resolveUiOptions() {
    return new UiOptions(this.uiOptions, this.uiType)
  }
}
