import { DebouncedFunc } from 'lodash';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Column, DataTable, PageCounter, Pagination, Tooltip } from '@/components';
import { Badge } from 'flowbite-react';
import { Activity } from '@/schemas/Activity.schema';
import { timestampToUtcString } from '@/utils/date-time-utils';

interface TableProps {
  data: Activity[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: DebouncedFunc<(page: any) => void>;
  setOrder?: (sort: string) => void;
  onRowClick?: (row: Activity) => void;
  order?: string;
  totalPages: number;
  totalCount: number;
}

const ActivitiesListTable: React.FC<TableProps> = ({
  data,
  isLoading,
  currentPage,
  onPageChange,
  onRowClick,
  setOrder,
  order,
  totalPages,
  totalCount,
}) => {
  const intl = useIntl();
  const columns = useMemo(() => {
    /*
      note that the datatable has default rendering for attributes at the top level of the passed in data object so all
      that needs to be passed in is the attribute name via the key prop in the column. BUT the activity type has data
      that is not at the top level of the object so custom render functions are required.
     */
    const staticColumns: Column[] = [
      {
        title: <FormattedMessage id="registry-project-id" />,
        key: 'projectId',
        render: (row: Activity) => {
          const projectId: string | number = row?.cw_project?.projectId || '--';
          return (
            <Tooltip content={projectId}>
              <div style={{ maxWidth: '310px' }}>
                <p className="text-left text-ellipsis w-full overflow-hidden whitespace-nowrap">{projectId}</p>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: <FormattedMessage id="project-name" />,
        key: 'projectName',
        render: (row: Activity) => {
          const projectName: string | number = row?.cw_project?.projectName || '--';
          return (
            <Tooltip content={projectName}>
              <div style={{ maxWidth: '310px' }}>
                <p className="text-left text-ellipsis w-full overflow-hidden whitespace-nowrap">{projectName}</p>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: <FormattedMessage id="vintage-year" />,
        key: 'vintageYear',
        render: (row: Activity) => {
          const vintageYear: string | number = row?.cw_unit?.vintageYear || '--';
          return (
            <Tooltip content={vintageYear}>
              <div style={{ maxWidth: '310px' }}>
                <p className="text-left text-ellipsis w-full overflow-hidden whitespace-nowrap">{vintageYear}</p>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: <FormattedMessage id="action" />,
        key: 'mode',
        render: (row: Activity) => {
          const action = row?.mode;
          let color: string = '';
          let displayText = '';
          switch (action) {
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
        },
      },
      {
        title: <FormattedMessage id="tons-co2" />,
        key: 'amount',
        render: (row: Activity) => {
          const amount = row.amount ? row.amount / 1000 : '--';
          return (
            <Tooltip content={amount}>
              <div style={{ maxWidth: '310px' }}>
                <p className="text-left text-ellipsis w-full overflow-hidden whitespace-nowrap">{amount}</p>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: <FormattedMessage id="timestamp-utc" />,
        key: 'timestamp',
        render: (row: Activity) => {
          const timestampDate: string = timestampToUtcString(row.timestamp * 1000);
          return (
            <Tooltip content={timestampDate}>
              <div style={{ maxWidth: '310px' }}>
                <p className="text-left text-ellipsis w-full overflow-hidden whitespace-nowrap">{timestampDate}</p>
              </div>
            </Tooltip>
          );
        },
      },
    ];

    return staticColumns;
  }, [intl]);

  return (
    <>
      <DataTable
        columns={columns}
        onChangeOrder={setOrder}
        onRowClick={onRowClick}
        order={order}
        data={data}
        primaryKey="warehouseUnitId"
        isLoading={isLoading}
        tableHeightOffsetPx={320}
        footer={
          <>
            <PageCounter currentPage={currentPage} totalCount={totalCount} />
            <Pagination
              currentPage={currentPage}
              layout="pagination"
              onPageChange={onPageChange}
              showIcons={true}
              totalPages={totalPages || 1}
            />
          </>
        }
      />
    </>
  );
};

export { ActivitiesListTable };
