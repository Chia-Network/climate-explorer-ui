import React, { useCallback } from 'react';
import { useQueryParamState } from '@/hooks';
import { debounce } from 'lodash';
import { SearchBox } from '@/components';

const TokensPage: React.FC = () => {
  const [search, setSearch] = useQueryParamState('search', undefined);
  const [order, setOrder] = useQueryParamState('order', undefined);

  const handleSearchChange = useCallback(
    debounce((event: any) => {
      setSearch(event.target.value);
    }, 800),
    [setSearch, debounce],
  );

  return (
    <>
      <div className="pt-2 pl-2 pr-2 h-full">
        <div className="flex flex-col md:flex-row gap-6 my-2.5 relative z-30 items-center h-auto">
          <SearchBox defaultValue={search} onChange={handleSearchChange} />
        </div>
        <UntokenizedUnitsTab
          search={search}
          order={order}
          setOrder={setOrder}
          setShowTokenizationModal={setTokenizeModalActive}
        />
      </div>
    </>
  );
};

export { TokensPage };
