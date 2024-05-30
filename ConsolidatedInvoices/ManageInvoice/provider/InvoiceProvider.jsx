import React from 'react';

import ConsolidatedInvoice from '../ConsolidatedInvoice';

export const InvoiceContext = React.createContext({});

export const InvoiceProvider = ({ children }) => {
  const [links, setLinks] = React.useState(null);
  const [invoice, setInvoice] = React.useState(new ConsolidatedInvoice());
  const [shouldReloadInvoice, setShouldReloadInvoice] = React.useState(false);

  const values = {
    links,
    shouldReloadInvoice,
    invoice,
  };

  const actions = {
    setLinks,
    setShouldReloadInvoice,
    setInvoice,
  };

  const context = {
    values,
    actions,
  };

  return (
    <InvoiceContext.Provider value={context}>
      {children}
    </InvoiceContext.Provider>
  );
};
