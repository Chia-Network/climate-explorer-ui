import { useColumnOrderHandler, useQueryParamState, useWildCardUrlHash } from '@/hooks';
import { debounce } from 'lodash';
import {
  ActivitiesListTable,
  ActivityDetailsModal,
  IndeterminateProgressOverlay,
  SearchBox,
  SkeletonTable,
} from '@/components';
import { FormattedMessage } from 'react-intl';
import { useGetActivitiesQuery } from '@/api';
import { RECORDS_PER_PAGE } from '@/api/climate-explorer/v1';
import React from 'react';
import { Activity } from '@/schemas/Activity.schema';

const ActivitiesPage: React.FC = () => {
  const [search, setSearch] = useQueryParamState('search', undefined);
  const [order, setOrder] = useQueryParamState('order', undefined);
  const [currentPage, setCurrentPage] = useQueryParamState('page', '1');
  const handleSetOrder = useColumnOrderHandler(order, setOrder);
  const [activityDetailsModalUrlFragment, showActivityDetailsModal, setShowActivityDetailsModalActive] =
    useWildCardUrlHash('activity-details');

  /**
   * use column order handler tags the order with the table column key in the form 'col_key:order'
   * the explorer api does not support this format and can only joint sort on height and coin_id
   *
   * this is the extracted order without the column key
   */
  const explorerApiCompatibleOrder: string = order?.split(':')?.[1];

  const {
    data: activitiesData,
    isLoading: activitiesQueryLoading,
    isFetching: activitiesQueryFetching,
    error: activitiesQueryError,
  } = useGetActivitiesQuery({
    search,
    page: Number(currentPage),
    sort: explorerApiCompatibleOrder,
  });

  const handleSearchChange = debounce((event: any) => setSearch(event.target.value), 800);
  const handlePageChange = debounce((page) => setCurrentPage(page), 800);
  const handleActivitiesTableRowClick = (activity: Activity) => {
    const warehouseUnitId = activity?.cw_unit?.warehouseUnitId || '';
    const coinId = activity?.coin_id || '';
    const actionMode = activity?.mode || '';
    const urlHashContents: string = warehouseUnitId + '^' + coinId + '^' + actionMode;

    setShowActivityDetailsModalActive(true, urlHashContents);
  };

  if (activitiesQueryError) {
    return <FormattedMessage id={'unable-to-load-contents'} />;
  }

  if (activitiesQueryLoading) {
    return <SkeletonTable />;
  }

  if (!activitiesData?.total) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="sentence-case font-medium text-lg">
          <FormattedMessage id="no-climate-activity-data-to-display" />
        </div>
      </div>
    );
  }

  return (
    <>
      {activitiesQueryFetching && <IndeterminateProgressOverlay />}
      <div className="pt-2 pl-2 pr-2 h-full">
        <div className="flex flex-col md:flex-row gap-6 my-2.5 relative z-30 items-center h-auto">
          <SearchBox defaultValue={search} onChange={handleSearchChange} />
        </div>
        <ActivitiesListTable
          data={activitiesData?.activities || []}
          isLoading={activitiesQueryLoading}
          currentPage={Number(currentPage)}
          onPageChange={handlePageChange}
          setOrder={handleSetOrder}
          onRowClick={handleActivitiesTableRowClick}
          order={order}
          totalPages={Math.ceil(activitiesData.total / RECORDS_PER_PAGE)}
          totalCount={activitiesData.total}
        />
      </div>

      {showActivityDetailsModal && (
        <ActivityDetailsModal
          warehouseUnitId={activityDetailsModalUrlFragment.replace('activity-details-', '')}
          onClose={() => setShowActivityDetailsModalActive(false, '')}
        />
      )}
    </>
  );
};

export { ActivitiesPage };
