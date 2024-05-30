import { findFieldDiff, getFieldDiffsClasses } from './useFieldDiff';

describe('useFieldDiff', () => {
  const fieldClasses = {
    fieldControlWarning: 'fieldControlWarning',
    fieldWarning: 'fieldWarning',
  };

  describe('findFieldDiff', () => {
    it('should return fieldDiff with partial match', () => {
      const fieldDiff = findFieldDiff(
        [
          { target: '$.data.customer.part', status: 'replace' },
          { target: '$.data.policyVersion', status: 'remove' },
        ],
        {
          'ui:field': 'EndorsementsField',
        },
        '$.data.customer'
      );

      expect(fieldDiff).toEqual({
        target: '$.data.customer.part',
        status: 'replace',
      });
    });

    it('should return fieldDiff with partial match', () => {
      let fieldDiff = findFieldDiff(
        [
          { target: '$.data.customer.part', status: 'replace' },
          { target: '$.data.policyVersion', status: 'remove' },
        ],
        {},
        '$.data.customer'
      );

      expect(fieldDiff).toEqual(undefined);

      fieldDiff = findFieldDiff(
        [
          { target: '$.data.customer', status: 'replace' },
          { target: '$.data.policyVersion', status: 'remove' },
        ],
        {},
        '$.data.customer'
      );

      expect(fieldDiff).toEqual({
        target: '$.data.customer',
        status: 'replace',
      });
    });
  });

  describe('getFieldDiffsClasses', () => {
    it('should return undefined with no args', () => {
      const fieldDiff = getFieldDiffsClasses();

      expect(fieldDiff).toEqual(undefined);
    });

    it('should match return correct classes', () => {
      const fieldDiff = getFieldDiffsClasses(
        { target: '$.data.customer', status: 'replace' },
        {},
        fieldClasses
      );

      expect(fieldDiff).toEqual({ fieldControlWarning: true });
    });

    it('should match return different classes for ui widgets', () => {
      const fieldDiff = getFieldDiffsClasses(
        { target: '$.data.customer', status: 'replace' },
        { 'ui:widget': 'RadiobuttonWidget' },
        fieldClasses
      );

      expect(fieldDiff).toEqual({ fieldWarning: true });
    });
  });
});
