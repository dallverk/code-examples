<template>
  <div v-if="activeProperty" flush>
    <EditorPropertySection
      :title="__('schemas.editor-property-options')"
      :options="generalOptions"
    >
      <template #form-input="{ item }">
        <VJsoneditor
          v-if="item.isObjectType"
          :id="`${item.key}-input`"
          v-model="activeProperty[item.key]"
          height="50"
          :options="jsonEditorOptions"
        />
        <b-form-input
          v-else
          :id="`${item.key}-input`"
          v-model="activeProperty[item.key]"
          size="sm"
          type="text"
        />
      </template>
    </EditorPropertySection>
    <EditorPropertySection
      :title="__('schemas.editor-ui-options')"
      :options="uiOptions"
    >
      <template #form-input="{ item }">
        <b-form-checkbox
          v-if="item.isBooleanType"
          :id="`${item.key}-input`"
          v-model="activeProperty.uiOptions[item.key]"
          switch
          size="sm"
          class="mr-n2"
        />
        <b-form-input
          v-if="item.isTextType"
          :id="`${item.key}-input`"
          v-model="activeProperty.uiOptions[item.key]"
          size="sm"
          type="text"
        />
        <VJsoneditor
          v-if="item.isObjectType"
          :id="`${item.key}-input`"
          v-model="activeProperty.uiOptions[item.key]"
          height="50"
          :options="jsonEditorOptions"
        />
      </template>
    </EditorPropertySection>
    <EditorPropertySection
      :title="__('schemas.editor-ui-miscellaneous')"
      :options="uiProperties"
    >
      <template #form-input="{ item }">
        <VJsoneditor
          v-if="item.isObjectType"
          :id="`${item.key}-input`"
          v-model="activeProperty[item.key]"
          height="50"
          :options="jsonEditorOptions"
        />
      </template>
    </EditorPropertySection>
  </div>
</template>

<script>
import { SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY_GETTER } from '@/Modules/Schema/SchemaDesigner/SchemaDesignerModule'
import { mapGetters } from 'vuex'
import EditorPropertySection from '@/Modules/Schema/SchemaDesigner/Components/EditorAssistant/EditorPropertySection'
import VJsoneditor from '@wedevlt/v-jsoneditor'

export default {
  components: { EditorPropertySection, VJsoneditor },

  props: {
    jsonEditorOptions: {
      type: Object,
      default: () => ({
        mainMenuBar: false,
        navigationBar: false,
        statusBar: false,
        search: false,
        mode: 'code',
        indentation: 2,
      }),
    },
  },

  computed: {
    ...mapGetters('SchemaDesignerModule', {
      activeProperty: SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY_GETTER,
    }),

    uiOptions() {
      return this.activeProperty?.uiOptionsKeys
    },

    generalOptions() {
      return this.activeProperty?.editableKeys
    },

    uiProperties() {
      return this.activeProperty?.uiPropertiesKeys
    },
  },
}
</script>
