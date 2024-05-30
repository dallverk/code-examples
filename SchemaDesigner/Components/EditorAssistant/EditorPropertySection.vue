<template>
  <div class="property-section mb-3">
    <b-button
      class="w-100 d-flex align-items-center justify-content-between"
      variant="light"
      size="sm"
      :disabled="!options.length"
      @click="visible = !visible"
    >
      <span class="font-weight-bold">{{ title }}</span>
      <Icon v-if="visible" icon="angle-down" size="14" />
      <Icon v-else icon="angle-right" size="14" />
    </b-button>
    <b-collapse id="collapse-library" v-model="visible" class="mt-3">
      <div
        v-for="item in booleanOptions"
        :key="item.key"
        class="form-check form-check-inline mb-3"
      >
        <slot :item="item" name="form-input" />
        <label :for="`${item.key}-input`" class="form-check-label small ml-1">
          {{ item.label }}
        </label>
      </div>
      <div v-for="item in textOptions" :key="item.key" class="form-group row">
        <label
          class="col-sm-4 col-form-label text-right"
          :for="`${item.key}-input`"
        >
          {{ item.label }}
        </label>
        <div class="col-sm-8">
          <slot :item="item" name="form-input" />
        </div>
      </div>
      <div v-for="item in jsonOptions" :key="item.key" class="form-group">
        <label :for="`${item.key}-input`">
          {{ item.label }}
        </label>
        <slot :item="item" name="form-input" />
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: true,
      booleanOptions: [],
      textOptions: [],
      jsonOptions: [],
    }
  },
  watch: {
    options: {
      handler(newValue) {
        if (!_.isArray(newValue)) {
          return
        }
        this.booleanOptions = newValue.filter((item) => item.isBooleanType)
        this.jsonOptions = newValue.filter((item) => item.isObjectType)
        this.textOptions = newValue.filter(
          (item) => !item.isBooleanType && !item.isObjectType
        )
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>
<style lang="scss">
.property-section {
  .form-group {
    margin-bottom: 1em;

    .b-custom-control-sm {
      transform: translateY(8px);
    }

    label {
      padding-right: 0;
      font-size: 13px;
    }
  }
}
</style>