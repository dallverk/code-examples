export class ConsolidatedInvoice {
  id = null;
  invoiceNo = null;
  brokerShortName = null;
  currency = null;
  periodStartDate = null;
  periodEndDate = null;
  dueDate = null;
  status = null;
  totalReceivable = null;
  invoicesCount = null;

  constructor(data = {}) {
    for (const [key, value] of Object.entries(data)) this[key] = value;
  }
}

export default ConsolidatedInvoice;
