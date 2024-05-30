import React from 'react';

import { InvoiceContext } from '../provider';

export default () => {
  const invoiceContext = React.useContext(InvoiceContext);

  return {
    invoiceContext,
  };
};
