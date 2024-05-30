<template>
  <Component
    :is="node.component"
    :node="node"
    designer-mode
    @drag-start="dragstart"
    @drag-end="dragend"
  >
    <template #node-actions>
      <NodeOverlay
        :active="showOverlay"
        :style="{
          'z-index': zIndex,
        }"
        @click="onClick"
        @drop="onDrop"
      >
        <template v-if="node.parent" #node-controls>
          <NodeControls
            :on-copy="handleCopyClick"
            :on-remove="handleRemoveClick"
          />
        </template>
      </NodeOverlay>
      <NodePortOverlay
        v-if="node.canInsertNode && node.parent"
        :style="{
          'z-index': zIndex,
        }"
        @drop="onDropPort"
      />
    </template>
  </Component>
</template>

<script>
import UiTypeMoney from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeMoney'
import UiTypeDate from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeDate'
import UiTypeToggler from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeToggler'
import UiTypeRadios from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeRadios'
import UiTypeButton from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeButton'
import UiTypeCheckboxes from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeCheckboxes'
import UiTypeMissing from '@/Modules/Quote/Components/QuoteForm/Elements/UiTypeMissing'
import UiTypeRoot from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeRoot'
import UiTypeSection from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeSection'
import UiTypeText from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeText'
import UiTypeSelect from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeSelect'
import UiTypeClient from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeClient'
import UiTypeTextArea from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeTextArea'
import UiTypeRichTextArea from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeRichTextArea'
import UiTypeTag from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeTag'
import UiTypeEmail from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeEmail'
import UiTypeLink from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeLink'
import UiTypeIntegrationButton from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeIntegrationButton'
import UiTypeMoneySelect from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeMoneySelect'
import UiTypeCurrency from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeCurrency'
import UiTypeDecimal from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeDecimal'
import UiTypeUser from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeUser'
import UiTypeEntity from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeEntity'
import UiTypePolicyNumber from '@/Modules/Schema/SchemaDesigner/Elements/UiTypePolicyNumber'
import UiTypeNumber from '@/Modules/Schema/SchemaDesigner/Elements/UiTypeNumber'

import {
  EDITOR_PROPERTY_REMOVE,
  TOGGLE_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY,
  SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY_GETTER,
  EDITOR_TREE_PROPERTY_INSERT,
  EDITOR_TREE_PROPERTY_MOVE,
  EDITOR_TREE_PROPERTY_COPY,
  EditorTreeActionOptions,
} from '@/Modules/Schema/SchemaDesigner/SchemaDesignerModule'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import NodeControls from '@/Modules/Schema/SchemaDesigner/Components/SchemaDesignerNode/NodeControls'
import NodeOverlay from '@/Modules/Schema/SchemaDesigner/Components/SchemaDesignerNode/NodeOverlay'
import NodePortOverlay from '@/Modules/Schema/SchemaDesigner/Components/SchemaDesignerNode/NodePortOverlay'
import DataTransfer, {
  DataTransferAction,
} from '@/Modules/Schema/SchemaDesigner/Classes/DataTransfer'

export default {
  components: {
    NodeControls,
    NodeOverlay,
    NodePortOverlay,
    /** ui types */
    UiTypeButton,
    UiTypeCheckboxes,
    UiTypeMissing,
    UiTypeRoot,
    UiTypeSection,
    UiTypeText,
    UiTypeSelect,
    UiTypeMoney,
    UiTypeDate,
    UiTypeToggler,
    UiTypeRadios,
    UiTypeClient,
    UiTypeTextArea,
    UiTypeRichTextArea,
    UiTypeTag,
    UiTypeEmail,
    UiTypeLink,
    UiTypeIntegrationButton,
    UiTypeMoneySelect,
    UiTypeCurrency,
    UiTypeDecimal,
    UiTypeUser,
    UiTypeEntity,
    UiTypePolicyNumber,
    UiTypeNumber,
  },

  props: {
    node: {
      type: Object,
    },
  },

  computed: {
    ...mapGetters('SchemaDesignerModule', {
      activeProperty: SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY_GETTER,
    }),

    showOverlay() {
      return this.activeProperty?.id === this.node.id
    },

    zIndex() {
      return this.node.depth + 1
    },
  },

  methods: {
    ...mapMutations('SchemaDesignerModule', {
      insertProperty: EDITOR_TREE_PROPERTY_INSERT,
      moveProperty: EDITOR_TREE_PROPERTY_MOVE,
      copyProperty: EDITOR_TREE_PROPERTY_COPY,
    }),

    ...mapActions('SchemaDesignerModule', {
      removeProperty: EDITOR_PROPERTY_REMOVE,
      toggleActiveProperty: TOGGLE_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY,
    }),

    onClick() {
      this.toggleActiveProperty(this.node.key)
    },

    dragover(event) {
      event.preventDefault()
    },

    onDrop(data) {
      const { action, value } = DataTransfer.parseData(data)
      if (action === DataTransferAction.move) {
        this.moveProperty({ node: this.node, value })
        return
      }
      this.insertProperty({ node: this.node, value })
    },

    onDropPort(data) {
      const { action, value } = DataTransfer.parseData(data)
      const options = new EditorTreeActionOptions({ insertAsSibling: true })
      if (action === DataTransferAction.move) {
        this.moveProperty({ node: this.node, value, options })
        return
      }
      this.insertProperty({ node: this.node, value, options })
    },

    dragend(event) {
      event.target.className = event.target.className.replace('drag-active', '')
    },

    dragstart(event) {
      event.stopPropagation()
      const { data } = new DataTransfer(this.node.key, DataTransferAction.move)
      event.dataTransfer.setData('text/plain', data)
      event.target.className = event.target.className.concat(' drag-active')
    },

    handleRemoveClick() {
      if (this.node.key) {
        this.removeProperty(this.node.key)
      }
    },

    handleCopyClick() {
      if (this.node.key) {
        this.copyProperty(this.node.key)
      }
    },
  },
}
</script>
<style scoped lang="scss">
.drag-active {
  overflow: hidden;
}
</style>
