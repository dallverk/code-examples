<template>
  <b-button-toolbar class="node-controls position-absolute">
    <b-button-group size="sm">
      <b-button
        v-if="onCopy"
        data-testid="copy-node-btn"
        variant="primary"
        @click="onCopy"
      >
        <Icon icon="copy-alt" size="18" />
      </b-button>
      <b-button
        v-if="onRemove"
        data-testid="remove-node-btn"
        variant="danger"
        @click="onRemove"
      >
        <Icon icon="trash" size="18" />
      </b-button>
    </b-button-group>
  </b-button-toolbar>
</template>

<script>
export default {
  props: {
    onCopy: {
      type: Function,
      default: null,
    },
    onRemove: {
      type: Function,
      default: null,
    },
  },
}
</script>

<style scoped lang="scss">
.node-controls {
  top: 0;
  right: 0;
  transform: translateX(-6px) translateY(-100%);

  .btn-group-sm {
    > .btn,
    .btn-sm {
      line-height: 1.5;
    }
  }
}
</style>
