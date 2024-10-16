import { useColumnOrderHandler, useQueryParamState, useWildCardUrlHash } from '@/hooks';
import _, { debounce } from 'lodash';
import {
  ActivitiesListTable,
  ActivitiesSearchByDropDown,
  ActivityDetailsModal,
  IndeterminateProgressOverlay,
  SearchBox,
  SkeletonTable,
} from '@/components';
import { FormattedMessage } from 'react-intl';
import { ActivitySearchBy, useGetActivitiesQuery } from '@/api';
import React, { useEffect, useState } from 'react';
import { Activity } from '@/schemas/Activity.schema';
import { RECORDS_PER_PAGE, SEARCH_BY_CLIMATE_DATA, SEARCH_BY_ON_CHAIN_METADATA } from '@/utils/constants';
import { useParams } from 'react-router-dom';

const ActivitiesPage: React.FC = () => {
  // manage searchBy value and searchByString query param separately to avoid query trigger if no search
  const { orgUid } = useParams();
  const [search, setSearch] = useQueryParamState('search', undefined);
  const [searchByString, setSearchByString] = useQueryParamState('search-by', SEARCH_BY_CLIMATE_DATA);
  const [searchBy, setSearchBy] = useState<ActivitySearchBy | undefined>(undefined);
  const [order, setOrder] = useQueryParamState('order', undefined);
  const [currentPage, setCurrentPage] = useQueryParamState('page', '1');
  const handleSetOrder = useColumnOrderHandler(order, setOrder);
  const [activityDetailsModalUrlFragment, showActivityDetailsModal, setShowActivityDetailsModalActive] =
    useWildCardUrlHash('activity-details');

  useEffect(() => {
    if (searchByString !== SEARCH_BY_ON_CHAIN_METADATA && searchByString !== SEARCH_BY_CLIMATE_DATA) {
      setSearchByString(SEARCH_BY_CLIMATE_DATA);
    }
  }, [searchByString, setSearchByString]);

  useEffect(() => {
    if (search) {
      const searchBy: ActivitySearchBy =
        searchByString === SEARCH_BY_ON_CHAIN_METADATA || searchByString === SEARCH_BY_CLIMATE_DATA
          ? searchByString
          : SEARCH_BY_CLIMATE_DATA;
      setSearchBy(searchBy);
    } else if (!search && searchBy) {
      setSearchBy(undefined);
    }
  }, [search, searchBy, searchByString]);

  /**
   * use column order handler tags the order with the table column key in the form 'col_key:order'
   * the explorer api does not support this format and can only joint sort on height and coin_id
   *
   * this is the extracted order without the column key
   */
  const explorerApiCompatibleOrder: string | null = order?.split(':')?.[1];

  const {
    data: orgActivitiesData,
    isLoading: activitiesQueryLoading,
    isFetching: activitiesQueryFetching,
    error: activitiesQueryError,
  } = useGetActivitiesQuery(
    {
      searchBy,
      search,
      orgUid: orgUid || '',
      page: Number(currentPage),
      sort: explorerApiCompatibleOrder,
    },
    { skip: !orgUid },
  );

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

  if (activitiesQueryLoading || !orgUid) {
    return <SkeletonTable />;
  }

  if (_.isNil(orgActivitiesData?.total) || (!orgActivitiesData?.total && !search)) {
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
          <ActivitiesSearchByDropDown
            searchByString={searchByString as unknown as ActivitySearchBy}
            setSearchByString={setSearchByString}
          />
          <SearchBox defaultValue={search} onChange={handleSearchChange} />
        </div>
        <ActivitiesListTable
          data={orgActivitiesData?.activities || []}
          isLoading={activitiesQueryLoading}
          currentPage={Number(currentPage)}
          onPageChange={handlePageChange}
          setOrder={handleSetOrder}
          onRowClick={handleActivitiesTableRowClick}
          order={order}
          totalPages={Math.ceil(orgActivitiesData?.total / RECORDS_PER_PAGE)}
          totalCount={orgActivitiesData?.total}
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
