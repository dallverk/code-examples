<template>
  <div
    class="node-overlay overlay"
    :class="{ active }"
    @click="onClick"
    @drop="onDrop"
    @dragover="dragover"
    @dragenter="dragenter"
    @dragleave="dragleave"
  >
    <slot name="node-controls" />
  </div>
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

    onClick(event) {
      this.$emit('click', event)
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

.node-overlay {
  height: 100%;
  top: 0;
  left: 0;

  .node-controls {
    display: none;
  }

  &:hover {
    .node-controls {
      display: block;
    }
  }

  &.active {
    .node-controls {
      display: block;
    }
  }
}
</style>
