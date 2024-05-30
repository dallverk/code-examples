<template>
  <div
    class="node-port-overlay overlay"
    @drop="onDrop"
    @dragover="dragover"
    @dragenter="dragenter"
    @dragleave="dragleave"
  />
</template>

<script>
import NodeOverlayMixin from '@/Modules/Schema/SchemaDesigner/Components/SchemaDesignerNode/NodeOverlayMixin'

export default {
  mixins: [NodeOverlayMixin],
  methods: {
    onDrop(event) {
      event.preventDefault()
      this.replyDragOverStyles(event)
      const data = event.dataTransfer.getData('text/plain')
      this.$emit('drop', data, event)
    },
  },
}
</script>

<style scoped lang="scss">
.overlay {
  position: absolute;
  width: 100%;
  border-radius: 5px;
  border: 1px solid transparent;
  background-color: transparent;
  transition: background-color 0.2s ease;

  &.active {
    background-color: rgba(44, 123, 229, 0.1);
    border-color: rgba(44, 123, 229, 0.2);
  }
}

.node-port-overlay {
  height: 10px;
  left: 0;
  bottom: 0;
  transform: translateY(100%);
}
</style>
