import _ from 'lodash'
import PropertyParametersField from '@/Modules/Schema/SchemaDesigner/Classes/PropertyParametersField'
import { UiTypes } from '@/Modules/Schema/SchemaDesigner/Classes/UiTypes'

export const FieldTypes = Object.freeze({
  boolean: 'boolean',
  string: 'string',
  object: 'object',
  select: 'select',
})

export const UiOption = Object.freeze({
  showTime: 'showTime',
  multiple: 'multiple',
  classColumn: 'classColumn',
  status: 'status',
  visible: 'visible',
  required: 'required',
  readonly: 'readonly',
  quoteField: 'quoteField',
  placeholder: 'placeholder',
  class: 'class',
})

export const UiOptionsMap = Object.freeze({
  [UiOption.showTime]: [UiTypes.date],
  [UiOption.multiple]: [UiTypes.email],
  [UiOption.classColumn]: [
    UiTypes.section,
    UiTypes.button,
    UiTypes.textArea,
    UiTypes.integrationButton,
  ],
  [UiOption.status]: [UiTypes.integrationButton],
  [UiOption.readonly]: [
    UiTypes.text,
    UiTypes.checkboxes,
    UiTypes.select,
    UiTypes.money,
    UiTypes.date,
    UiTypes.toggler,
    UiTypes.radios,
    UiTypes.client,
    UiTypes.textArea,
    UiTypes.richTextArea,
    UiTypes.tag,
    UiTypes.email,
    UiTypes.link,
    UiTypes.moneySelect,
    UiTypes.currency,
    UiTypes.decimal,
    UiTypes.button,
    UiTypes.textArea,
    UiTypes.integrationButton,
    UiTypes.user,
    UiTypes.entity,
  ],
  [UiOption.required]: [
    UiTypes.text,
    UiTypes.checkboxes,
    UiTypes.select,
    UiTypes.money,
    UiTypes.date,
    UiTypes.toggler,
    UiTypes.radios,
    UiTypes.client,
    UiTypes.textArea,
    UiTypes.richTextArea,
    UiTypes.tag,
    UiTypes.email,
    UiTypes.link,
    UiTypes.moneySelect,
    UiTypes.currency,
    UiTypes.decimal,
    UiTypes.user,
    UiTypes.entity,
  ],
})

export default class UiOptions {
  visible = true
  required = false
  classColumn = ''
  class = ''
  icon = ''
  placeholder = ''
  readonly = false
  showTime = false
  multiple = false
  status = null
  quoteField = ''

  constructor(data = {}, uiType = '') {
    _.keys(data).forEach((key) => {
      this[key] = data[key]
    })

    this.uiType = uiType
  }

  get editableOptions() {
    return _.values(UiOption)
      .filter((key) => {
        if (UiOptionsMap[key]) {
          return UiOptionsMap[key].includes(this.uiType)
        }
        return true
      })
      .map(
        (key) =>
          new PropertyParametersField({
            key,
            type: this.resolveType(key),
            label: key,
          })
      )
  }

  resolveType(key) {
    switch (key) {
      case UiOption.visible:
      case UiOption.required:
      case UiOption.readonly:
      case UiOption.showTime:
      case UiOption.multiple:
        return FieldTypes.boolean
      case UiOption.status:
        return FieldTypes.object
      default:
        return FieldTypes.string
    }
  }
}
