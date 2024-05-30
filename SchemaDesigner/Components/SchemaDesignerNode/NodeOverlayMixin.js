export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    dragover(event) {
      event.preventDefault()
    },
    dragenter(event) {
      this.applyDragOverStyles(event)
    },
    dragleave(event) {
      this.replyDragOverStyles(event)
    },
    replyDragOverStyles(event) {
      if (event.target.className.includes('active')) {
        event.target.className = event.target.className.replace('active', '')
      }
    },
    applyDragOverStyles(event) {
      if (event.target.className.includes('overlay')) {
        event.target.className = event.target.className.replace(
          'overlay',
          'overlay active'
        )
      }
    },
  },
}
