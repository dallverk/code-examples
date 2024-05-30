import React from 'react';

import { usePriceField } from 'src/effects/fields';
import { TableCell } from 'src/components/Table';

const PolicyLink = ({ data }) => (
  <TableCell.RouteLink
    link={`/policy/${data?.policyId}`}
    label={() => data?.policyNo}
  />
);

export const ActionKeys = {
  Remove: 'onRemove',
  Add: 'onAdd',
};

export const Actions = Object.freeze({
  [ActionKeys.Remove]: {
    label: 'Remove',
  },
  [ActionKeys.Add]: {
    label: 'Add',
  },
});

export const useColumns = ({ actions }) => {
  const priceFieldFormatter = usePriceField();

  const columns = [
    {
      id: 'invoiceNo',
      label: 'Invoice No',
      type: { id: 'text' },
    },
    {
      id: 'policyNo',
      label: 'Policy No',
      component: PolicyLink,
      type: {
        id: 'custom',
      },
    },
    {
      id: 'createdDate',
      label: 'Created',
      type: {
        id: 'date',
      },
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      type: {
        id: 'date',
      },
    },
    {
      id: 'customerName',
      label: 'Customer',
      type: { id: 'text' },
    },
    {
      id: 'premium',
      label: 'Premium',
      type: {
        id: 'text',
        properties: {
          formatValue: priceFieldFormatter,
        },
      },
    },
    {
      id: 'commission',
      label: 'Commission',
      type: {
        id: 'text',
        properties: {
          formatValue: priceFieldFormatter,
        },
      },
    },
    {
      id: 'invoiceSum',
      label: 'Receivable',
      type: {
        id: 'text',
        properties: {
          formatValue: priceFieldFormatter,
        },
      },
    },
  ];

  if (!actions) return columns;

  const getAction = action => Actions[action];

  return Object.entries(actions).reduce((acc, [key, value]) => {
    if (!value) return acc;

    acc = acc.concat({
      id: null,
      label: '',
      type: {
        id: 'button',
        properties: {
          label: getAction(key)?.label,
        },
      },
      action: value,
    });

    return acc;
  }, columns);
};

export default useColumns;
