<template>
  <div class="mb-3">
    <b-button
      class="w-100 d-flex align-items-center justify-content-between"
      variant="light"
      size="sm"
      @click="visible = !visible"
    >
      <span class="font-weight-bold">{{ __('schemas.editor-ui-types') }}</span>
      <Icon v-if="visible" icon="angle-down" size="14" />
      <Icon v-else icon="angle-right" size="14" />
    </b-button>
    <b-collapse id="collapse-library" v-model="visible" class="mt-3">
      <b-form-input
        v-model="search"
        class="mb-3"
        size="sm"
        type="text"
        debounce="100"
        :placeholder="__('schemas.editor-search-ui-types')"
        @input="handleSearchChange"
      />
      <div
        ref="uiTypesList"
        :style="{ height: '210px' }"
        class="position-relative"
      >
        <div>
          <b-card
            v-for="element in elements"
            :id="element.id"
            :key="element.id"
            no-body
            draggable="true"
            @dragstart="dragstart"
          >
            <div class="d-flex align-items-center">
              <Icon icon="grip-horizontal-line" size="14" class="text-muted" />
              <div class="ml-2 font-weight-normal">
                {{ element.label }}
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { UiTypes } from '@/Modules/Schema/SchemaDesigner/Classes/UiTypes'
import DataTransfer from '@/Modules/Schema/SchemaDesigner/Classes/DataTransfer'
import PerfectScrollbar from 'perfect-scrollbar'

export class PropertyLibraryItem {
  constructor(key) {
    this.id = key
    this.label = _.startCase(key)
    this.shortHand = _.first(this.label)
  }
}

export default {
  data() {
    return {
      elements: this.getLibrary(),
      search: null,
      visible: true,
    }
  },

  mounted() {
    this.ps = new PerfectScrollbar(this.$refs.uiTypesList, {
      suppressScrollX: true,
      wheelPropagation: false,
    })
  },

  destroyed() {
    if (this.ps) {
      this.ps = null
    }
  },

  methods: {
    dragstart(event) {
      const { data } = new DataTransfer(event.target.id)
      event.dataTransfer.setData('text/plain', data)
    },

    getLibrary() {
      return _.keys(UiTypes)
        .filter((item) => ![UiTypes.root, UiTypes.quote].includes(item))
        .map((key) => new PropertyLibraryItem(UiTypes[key]))
    },

    handleSearchChange(value) {
      this.elements = this.getLibrary().filter((item) =>
        item.label.toLowerCase().includes(value?.toLowerCase())
      )
    },
  },
}
</script>
<style scoped lang="scss">
.card {
  padding: 10px;
  cursor: grab;
  margin-bottom: 10px;
  box-shadow: none;

  &:hover {
    cursor: grab;
  }

  &:active {
    cursor: grabbing;
  }
}
</style>
