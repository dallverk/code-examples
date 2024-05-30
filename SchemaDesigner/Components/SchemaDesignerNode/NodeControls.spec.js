import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Icon from '@/General/Icon'
import NodeControls from './NodeControls.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.component('Icon', Icon)

describe('NodeControls', () => {
  let wrapper

  beforeEach(() => {
    wrapper = null
  })

  it('should have copy button if event handler provided', async () => {
    const onCopyMock = jest.fn()
    wrapper = mount(NodeControls, {
      localVue,
      propsData: {
        onCopy: onCopyMock,
      },
    })

    await wrapper.find('[data-testid="copy-node-btn"]').trigger('click')

    expect(onCopyMock).toBeCalled()
  })

  it('should have remove button if event handler provided', async () => {
    const onRemoveMock = jest.fn()
    wrapper = mount(NodeControls, {
      localVue,
      propsData: {
        onRemove: onRemoveMock,
      },
    })

    await wrapper.find('[data-testid="remove-node-btn"]').trigger('click')

    expect(onRemoveMock).toBeCalled()
  })
})
