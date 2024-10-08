import { useColumnOrderHandler, useQueryParamState, useWildCardUrlHash } from '@/hooks';
import { debounce } from 'lodash';
import { ActivitiesListTable, ActivityDetailsModal, SearchBox, SkeletonTable } from '@/components';
import { FormattedMessage } from 'react-intl';
import { useGetActivitiesQuery } from '@/api';
import { RECORDS_PER_PAGE } from '@/api/climate-explorer/v1';
import React, { useMemo } from 'react';
import { Activity } from '@/schemas/Activity.schema';
import { useParams } from 'react-router-dom';

const ActivitiesPage: React.FC = () => {
  const { orgUid } = useParams();
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
  console.log('%%%%%%', explorerApiCompatibleOrder);

  const {
    data: allActivitiesData,
    isLoading: activitiesQueryLoading,
    error: activitiesQueryError,
  } = useGetActivitiesQuery({
    search,
    page: Number(currentPage),
    sort: explorerApiCompatibleOrder,
  });

  const orgActivitiesData: Activity[] | undefined = useMemo<Activity[] | undefined>(() => {
    if (allActivitiesData?.activities?.map) {
      return allActivitiesData.activities.filter((activity) => activity?.cw_org?.orgUid === orgUid);
    } else {
      return undefined;
    }
  }, [allActivitiesData?.activities, orgUid]);

  const handleSearchChange = debounce((event: any) => setSearch(event.target.value), 800);
  const handlePageChange = debounce((page) => setCurrentPage(page), 800);

  if (activitiesQueryError) {
    return <FormattedMessage id={'unable-to-load-contents'} />;
  }

  if (activitiesQueryLoading || !orgUid) {
    return <SkeletonTable />;
  }

  if (!orgActivitiesData?.length) {
    return <FormattedMessage id={'no-records-found'} />;
  }

  return (
    <>
      <div className="pt-2 pl-2 pr-2 h-full">
        <div className="flex flex-col md:flex-row gap-6 my-2.5 relative z-30 items-center h-auto">
          <SearchBox defaultValue={search} onChange={handleSearchChange} />
        </div>
        <ActivitiesListTable
          data={orgActivitiesData || []}
          isLoading={activitiesQueryLoading}
          currentPage={Number(currentPage)}
          onPageChange={handlePageChange}
          setOrder={handleSetOrder}
          onRowClick={(activity: Activity) =>
            setShowActivityDetailsModalActive(true, activity?.cw_unit?.warehouseUnitId || '')
          }
          order={order}
          totalPages={Math.ceil(orgActivitiesData?.length / RECORDS_PER_PAGE)}
          totalCount={orgActivitiesData?.length}
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
