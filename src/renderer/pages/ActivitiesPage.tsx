import { useColumnOrderHandler, useQueryParamState } from '@/hooks';
import { debounce } from 'lodash';
import { ActivitiesListTable, SearchBox, SkeletonTable } from '@/components';
import { FormattedMessage } from 'react-intl';
import { useGetActivitiesQuery } from '@/api';
import { RECORDS_PER_PAGE } from '@/api/climate-explorer/v1';
import React from 'react';

const ActivitiesPage: React.FC = () => {
  const [search, setSearch] = useQueryParamState('search', undefined);
  const [order, setOrder] = useQueryParamState('order', undefined);
  const [currentPage, setCurrentPage] = useQueryParamState('page', '1');
  const handleSetOrder = useColumnOrderHandler(order, setOrder);
  const {
    data: activitiesData,
    isLoading: activitiesQueryLoading,
    error: activitiesQueryError,
  } = useGetActivitiesQuery({
    search,
    page: Number(currentPage),
    order,
  });

  const handleSearchChange = debounce((event: any) => setSearch(event.target.value), 800);

  const handlePageChange = debounce((page) => setCurrentPage(page), 800);

  if (activitiesQueryError) {
    return <FormattedMessage id={'unable-to-load-contents'} />;
  }

  if (activitiesQueryLoading) {
    return <SkeletonTable />;
  }

  if (!activitiesData?.total) {
    return <FormattedMessage id={'no-records-found'} />;
  }

  return (
    <>
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
          order={order}
          totalPages={Math.ceil(activitiesData.total / RECORDS_PER_PAGE)}
          totalCount={activitiesData.total}
        />
      </div>
    </>
  );
};

export { ActivitiesPage };
