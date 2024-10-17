import React from 'react';
import { Badge } from 'flowbite-react';
import { useIntl } from 'react-intl';
import { ClimateActionMode } from '@/api';

interface ClimateActionModeRendererProp {
  actionMode: ClimateActionMode | string;
}

const ClimateActionModeRenderer: React.FC<ClimateActionModeRendererProp> = ({ actionMode }) => {
  const intl = useIntl();

  let color: string = '';
  let displayText = '';
  switch (actionMode) {
    case 'TOKENIZATION': {
      color = 'lime';
      displayText = intl.formatMessage({ id: 'tokenization' });
      break;
    }
    case 'DETOKENIZATION': {
      color = 'yellow';
      displayText = intl.formatMessage({ id: 'detokenization' });
      break;
    }
    case 'PERMISSIONLESS_RETIREMENT': {
      color = 'red';
      displayText = intl.formatMessage({ id: 'retirement' });
      break;
    }
    default: {
      color = 'gray';
      displayText = '--';
      break;
    }
  }

  return (
    <div className="flex">
      <Badge color={color} size="sm" className="capitalize">
        {displayText}
      </Badge>
    </div>
  );
};

export { ClimateActionModeRenderer };
