import { statusFactory } from 'src/components/Status';
import { INVOICE_STATUS_CONFIG } from 'src/constants';

const Status = statusFactory(INVOICE_STATUS_CONFIG);

const InvoiceStatus = ({ data }) => {
  const { status } = data;

  return <Status status={status} />;
};

export default InvoiceStatus;
