import Emitter from 'src/lib/emitter';

const EventName = {
  UpdateLinkedInvoicesTable: 'update-linked-invoices-table',
  UpdateInvoicesTable: 'update-invoices-table',
  UpdateInvoice: 'update-invoice',
};

export class ManageInvoiceService {
  #emitter = new Emitter();

  updateInvoices() {
    this.#emitter.emit(EventName.UpdateInvoicesTable);
  }

  updateLinkedInvoices() {
    this.#emitter.emit(EventName.UpdateLinkedInvoicesTable);
  }

  updateInvoice() {
    this.#emitter.emit(EventName.UpdateInvoice);
  }

  subscribeLinkedInvoices(callback) {
    this.#emitter.on(EventName.UpdateLinkedInvoicesTable, callback);
  }

  subscribeInvoices(callback) {
    this.#emitter.on(EventName.UpdateInvoicesTable, callback);
  }

  subscribeInvoiceUpdate(callback) {
    this.#emitter.off(EventName.UpdateInvoice);

    this.#emitter.on(EventName.UpdateInvoice, callback);
  }
}

export default new ManageInvoiceService();
