import React from 'react';
import lodash from 'lodash';

import ConsolidatedInvoice from '../ConsolidatedInvoice';

export const UPDATE_PAGE_SELECTION = 'actionUpdatePageSelection';
export const UPDATE_ALL_PAGE_SELECTION = 'updateAllPageSelection';

export const getInvoices = (pages = {}) =>
  Object.values(pages)
    .reduce((acc, rows) => {
      acc = acc.concat(rows.filter(Boolean));

      return acc;
    }, [])
    .map(invoice => new ConsolidatedInvoice(invoice));

export const reducer = (state, action) => {
  if (action.type === UPDATE_ALL_PAGE_SELECTION) {
    const { rows, page } = action.payload;

    const pageSelection = lodash.cloneDeep(state.pageSelection);
    const selectedInvoicesRaw = lodash.cloneDeep(state.pageSelection);

    lodash.set(
      pageSelection,
      page,
      rows.map(item => {
        if (item.meta?.canCredit) return item.data;

        return null;
      })
    );

    lodash.set(
      selectedInvoicesRaw,
      page,
      rows.filter(item => !!item.meta?.canCredit).map(item => item.data)
    );

    const selectedInvoices = getInvoices(selectedInvoicesRaw);

    return {
      ...state,
      pageSelection,
      selectedInvoices,
    };
  }

  if (action.type === UPDATE_PAGE_SELECTION) {
    const { rows, page } = action.payload;

    const pageSelection = lodash.cloneDeep(state.pageSelection);

    lodash.set(pageSelection, page, rows);

    const selectedInvoices = getInvoices(pageSelection);

    return {
      ...state,
      pageSelection,
      selectedInvoices,
    };
  }

  throw Error('Unknown action.');
};

export const initialState = {
  selectedInvoices: [],
  pageSelection: {},
};

export default () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return [state, dispatch];
};
