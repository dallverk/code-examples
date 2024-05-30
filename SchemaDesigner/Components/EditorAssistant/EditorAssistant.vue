<template>
  <div class="sticky-top">
    <PropertyLibrary />
    <PropertyEditor />
  </div>
</template>
<script>
import PropertyEditor from '@/Modules/Schema/SchemaDesigner/Components/EditorAssistant/PropertyEditor'
import PropertyLibrary from '@/Modules/Schema/SchemaDesigner/Components/EditorAssistant/PropertyLibrary'

export default {
  components: { PropertyEditor, PropertyLibrary },
}
</script>
