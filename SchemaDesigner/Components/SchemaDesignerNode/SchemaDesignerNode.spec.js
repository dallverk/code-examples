import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Icon from '@/General/Icon'
import Vuex from 'vuex'
import VueButton from '@/General/Form/VueButton'
import SchemaDesignerNode from './SchemaDesignerNode.vue'
import {
  SchemaDesignerModule,
  TOGGLE_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY,
} from '@/Modules/Schema/SchemaDesigner/SchemaDesignerModule'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.component('Icon', Icon)
localVue.component('VueButton', VueButton)

describe('SchemaDesignerNode', () => {
  let wrapper
  let $route
  let store
  let clickMock

  beforeEach(() => {
    wrapper = null
    clickMock = jest.fn()
    store = new Vuex.Store({
      modules: {
        SchemaDesignerModule: {
          ...SchemaDesignerModule,
          actions: {
            [TOGGLE_SCHEMA_DESIGNER_EDITOR_ACTIVE_PROPERTY]: clickMock,
          },
        },
      },
    })
    $route = {
      path: '/',
      hash: '',
      params: {},
      query: {},
    }
  })

  it('should click overlay if node has key', async () => {
    wrapper = mount(SchemaDesignerNode, {
      localVue,
      propsData: {
        node: {
          component: 'UiTypeButton',
          key: 'a-key',
          dataKey: 'a-data-key',
          uiOptions: { visible: true },
        },
        designerMode: true,
      },
      mocks: {
        $route,
      },
      store,
    })

    wrapper.find('.node-overlay').trigger('click')

    expect(clickMock).toBeCalled()
  })
})
