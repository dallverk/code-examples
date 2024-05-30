<template>
  <b-button
    size="sm"
    class="mr-2"
    variant="outline-primary"
    @click="handleSaveClick"
  >
    <Icon icon="save" class="mr-2" size="14" />
    {{ __('buttons.save') }}
  </b-button>
</template>

<script>
import { SCHEMA_DESIGNER_TREE_GETTER } from '@/Modules/Schema/SchemaDesigner/SchemaDesignerModule'
import { mapGetters } from 'vuex'
import SchemaPartService from '@/Modules/Schema/SchemaPart/SchemaPartService'
import SchemaPartNode from '@/Modules/Schema/SchemaDesigner/Classes/SchemaPartNode'
import Parts from '@/Modules/Schema/SchemaDesigner/Classes/Parser/Parts'

export default {
  computed: {
    ...mapGetters('SchemaDesignerModule', {
      editorTree: SCHEMA_DESIGNER_TREE_GETTER,
    }),
  },

  methods: {
    handleSaveClick() {
      this.getPayload().then((payload) => {
        SchemaPartService.update(this.$route.params.schemaId, payload)
          .then(() => {
            this.$successToast(`Schema was successfully updated!`)
          })
          .catch((error) => {
            console.error(error)
          })
      })
    },

    getPayload() {
      return SchemaPartService.list(this.$route.params.schemaId)
        .then((data) => {
          const root = this.editorTree?.objectify()

          if (!root) {
            throw new Error('Bad payload')
          }

          const payload = SchemaPartNode.getSchemaPartsPayload(root)

          if (!payload) {
            throw new Error('Bad payload')
          }

          const parts = new Parts(data, undefined, payload.index)

          if (!parts?.payload) {
            throw new Error('Bad payload')
          }

          return parts.payload.reduce((acc, part) => {
            acc[part.name] = part.structure
            return acc
          }, {})
        })
        .catch((error) => {
          console.error('error', error)
        })
    },
  },
}
</script>
