import { InteractiveTooltip } from 'src/components/Tooltip';

const fieldWrapper = (FieldComponent, { className, fieldDiff }) => {
  if (
    fieldDiff &&
    (typeof fieldDiff.previous === 'string' ||
      typeof fieldDiff.previous === 'number')
  )
    return (
      <InteractiveTooltip
        title={fieldDiff.previous}
        tooltipContentClass={className}
      >
        {FieldComponent}
      </InteractiveTooltip>
    );

  console.log('fieldWrapper')

  return <div className={className}>{FieldComponent}</div>;
};

export default fieldWrapper;
