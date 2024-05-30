import React from 'react';

import useSchemaTheme from 'src/schema/theme';

const FIELD_DIFF_STATUSES = Object.freeze({
  REPLACE: 'replace',
  ADD: 'add',
  REMOVE: 'remove',
});

const SCHEMA_WIDGETS = Object.freeze({
  RadiobuttonWidget: 'RadiobuttonWidget',
  ProductSelect: 'ProductSelect',
  CheckboxWidget: 'CheckboxWidget',
});

const SCHEMA_FIELDS = Object.freeze({
  EndorsementsField: 'EndorsementsField',
});

const fieldContainerWidgets = [
  SCHEMA_WIDGETS.RadiobuttonWidget,
  SCHEMA_WIDGETS.ProductSelect,
  SCHEMA_WIDGETS.CheckboxWidget,
];

export const findFieldDiff = (fieldsDiff, uiSchema, fieldPath) => {
  if (!Array.isArray(fieldsDiff) || !fieldPath) return;

  return fieldsDiff.find(field => {
    /** Use just part of field target match in case of endorsements, bc of unstable API and tbh unable to build path until endorsement properties */
    if ([SCHEMA_FIELDS.EndorsementsField].includes(uiSchema?.['ui:field']))
      return field.target.includes(fieldPath);

    return field.target === fieldPath;
  });
};

export const getFieldDiffsClasses = (fieldDiff, uiSchema, fieldClasses) => {
  if (!fieldClasses || !fieldDiff) return;

  const { status } = fieldDiff;

  /** Apply classes to whole container in case of radio field */
  if (fieldContainerWidgets.includes(uiSchema?.['ui:widget']))
    switch (status) {
      case FIELD_DIFF_STATUSES.REPLACE:
        return {
          [fieldClasses.fieldWarning]: true,
        };
      case FIELD_DIFF_STATUSES.ADD:
        return {
          [fieldClasses.fieldSuccess]: true,
        };
      case FIELD_DIFF_STATUSES.REMOVE:
        return {
          [fieldClasses.fieldError]: true,
        };
      default:
        return '';
    }

  switch (status) {
    case FIELD_DIFF_STATUSES.REPLACE:
      return {
        [fieldClasses.fieldControlWarning]: true,
      };
    case FIELD_DIFF_STATUSES.ADD:
      return {
        [fieldClasses.fieldControlSuccess]: true,
      };
    case FIELD_DIFF_STATUSES.REMOVE:
      return {
        [fieldClasses.fieldControlError]: true,
      };
    default:
      return '';
  }
};

export default (fieldsDiff = [], uiSchema, fieldPath = '') => {
  const { fieldClasses } = useSchemaTheme('container');

  return React.useMemo(() => {
    const fieldDiff = findFieldDiff(fieldsDiff, uiSchema, fieldPath);

    const fieldsDiffClasses = getFieldDiffsClasses(
      fieldDiff,
      uiSchema,
      fieldClasses
    );

    return {
      fieldDiff,
      fieldsDiffClasses,
    };
  }, [fieldPath, fieldsDiff, fieldClasses]);
};
