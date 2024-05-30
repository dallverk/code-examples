import {
  getInvoices,
  reducer,
  UPDATE_ALL_PAGE_SELECTION,
  initialState,
  UPDATE_PAGE_SELECTION,
} from '../effects/useInvoiceListReducer';
import ConsolidatedInvoice from '../ConsolidatedInvoice';

describe('useInvoiceListReducer', () => {
  describe('getInvoices', () => {
    it('should return empty array with no args', () => {
      const data = getInvoices();

      expect(data).toEqual([]);
    });

    it('should return array with invoices', () => {
      const data = getInvoices({
        1: [{ invoiceNo: '111' }, { invoiceNo: '112' }, { invoiceNo: '113' }],
        2: [null, null, null],
        3: [{ invoiceNo: '311' }, null, { invoiceNo: '313' }],
      });

      expect(data.length).toEqual(5);
      expect(data[0] instanceof ConsolidatedInvoice).toEqual(true);
    });
  });

  describe('reducer', () => {
    it('should be a function', () => {
      expect(typeof reducer === 'function').toEqual(true);
    });

    describe(UPDATE_ALL_PAGE_SELECTION, () => {
      it('should return correct state', () => {
        const state = reducer(initialState, {
          type: UPDATE_ALL_PAGE_SELECTION,
          payload: {
            rows: [
              { meta: { canCredit: true }, data: { invoiceNo: 1 } },
              { meta: { canCredit: false }, data: { invoiceNo: 2 } },
              { meta: { canCredit: true }, data: { invoiceNo: 3 } },
            ],
            page: 0,
          },
        });

        expect(state.pageSelection).toEqual({
          0: [{ invoiceNo: 1 }, null, { invoiceNo: 3 }],
        });

        expect(state.selectedInvoices).toEqual([
          new ConsolidatedInvoice({ invoiceNo: 1 }),
          new ConsolidatedInvoice({ invoiceNo: 3 }),
        ]);
      });
    });

    describe(UPDATE_PAGE_SELECTION, () => {
      it('should return correct state', () => {
        const state = reducer(initialState, {
          type: UPDATE_PAGE_SELECTION,
          payload: {
            rows: [{ invoiceNo: 1 }, null, { invoiceNo: 3 }],
            page: 1,
          },
        });

        expect(state.pageSelection).toEqual({
          1: [{ invoiceNo: 1 }, null, { invoiceNo: 3 }],
        });

        expect(state.selectedInvoices).toEqual([
          new ConsolidatedInvoice({ invoiceNo: 1 }),
          new ConsolidatedInvoice({ invoiceNo: 3 }),
        ]);
      });
    });
    
  });
});
