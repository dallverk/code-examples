<template>
  <EditorLayout>
    <template v-if="editorTree" #canvas>
      <SchemaDesignerNode
        v-for="(property, key) in editorTree"
        :key="key"
        :node="property"
      />
    </template>
    <template #palette>
      <EditorAssistant />
    </template>
  </EditorLayout>
</template>

<script>
import {
  SCHEMA_DESIGNER_TREE_GETTER,
  SCHEMA_DESIGNER_PROPERTIES_GETTER,
  SET_SCHEMA_DESIGNER_TREE,
} from '@/Modules/Schema/SchemaDesigner/SchemaDesignerModule'
import { mapGetters } from 'vuex'
import EditorLayout from '@/Modules/Schema/SchemaDesigner/Components/EditorLayout'
import EditorAssistant from '@/Modules/Schema/SchemaDesigner/Components/EditorAssistant/EditorAssistant'
import Tree from '@/Modules/Schema/SchemaDesigner/Classes/Parser/Tree'
import SchemaTreeNode from '@/Modules/Schema/SchemaDesigner/Classes/SchemaTreeNode'

export default {
  components: { EditorLayout, EditorAssistant },

  computed: {
    ...mapGetters('SchemaDesignerModule', {
      editorTree: SCHEMA_DESIGNER_TREE_GETTER,
      editorProperties: SCHEMA_DESIGNER_PROPERTIES_GETTER,
    }),
  },

  watch: {
    editorProperties: {
      handler(newValue) {
        if (!newValue?.properties) {
          return
        }
        this.setEditor(
          newValue.properties,
          newValue.apiIntegrations,
          newValue.version
        )
      },
      deep: true,
    },
  },

  methods: {
    setEditor(properties = {}, apiIntegrations, version) {
      const tree = new Tree(
        { uiType: 'root', properties, apiIntegrations, version },
        SchemaTreeNode
      )

      this.$store.commit(
        `SchemaDesignerModule/${SET_SCHEMA_DESIGNER_TREE}`,
        tree
      )
    },
  },
}
</script>
