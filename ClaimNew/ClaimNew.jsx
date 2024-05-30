import React from 'react';

import { SchemaProvider } from './SchemaProvider';
import ClaimPage from './ClaimPage';

export default () => (
  <SchemaProvider>
    <ClaimPage />
  </SchemaProvider>
);
