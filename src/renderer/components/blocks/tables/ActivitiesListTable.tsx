import { DebouncedFunc } from 'lodash';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
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
          const action = row?.mode || '--';
          let color: string = '';
          switch (action) {
            case 'TOKENIZATION': {
              color = 'lime';
              break;
            }
            case 'DETOKENIZATION': {
              color = 'yellow';
              break;
            }
            case 'PERMISSIONLESS_RETIREMENT': {
              color = 'red';
              break;
            }
            default: {
              color = 'gray';
              break;
            }
          }

          return (
            <div className="flex">
              <Badge color={color} size="sm">
                {action}
              </Badge>
            </div>
          );
        },
      },
      {
        title: <FormattedMessage id="amount" />,
        key: 'amount',
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
  }, []);

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
