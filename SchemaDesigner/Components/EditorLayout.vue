<template>
  <b-row>
    <b-col cols="12 mb-3">
      <slot name="toolbar" />
    </b-col>
    <b-col>
      <slot name="canvas" />
    </b-col>
    <b-col cols="auto">
      <div :style="{ width: '268px' }">
        <slot name="palette" />
      </div>
    </b-col>
  </b-row>
</template>
