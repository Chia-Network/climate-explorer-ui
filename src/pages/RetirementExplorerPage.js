import _ from 'lodash';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import {
  H3,
  UnitDetailedView,
  SearchInputWithFilters,
  Table,
  TableColumnTypeEnum,
} from '../components';
import { getExplorerData } from '../store/actions/appActions';
import constants from '../constants';
import { useWindowSize } from '../hooks/useWindowSize';

const StyledSectionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledHeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  padding: 30px 24px 14px 16px;
`;

const StyledBodyContainer = styled('div')`
  flex-grow: 1;
`;

const NoDataMessageContainer = styled('div')`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const filterOptions = [
  { value: 'climate_warehouse', label: 'Climate Data' },
  {
    value: 'onchain_metadata',
    label: 'Beneficiary Information',
  },
];

const RetirementExplorerPage = () => {
  const dispatch = useDispatch();
  const initialSearchFilter = filterOptions[0];
  const [searchOptions, setSearchOptions] = useState({
    query: '',
    filter: initialSearchFilter.value,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState(initialSearchFilter);
  const [modalSizeAndPosition, setModalSizeAndPosition] = useState(null);
  const pageContainerRef = useRef(null);
  const [page, setPage] = useState(1);
  const { explorerData, paginationNrOfPages } = useSelector(store => store);
  const windowSize = useWindowSize();
  const [unitToBeViewed, setUnitToBeViewed] = useState(null);
  let [searchParams] = useSearchParams();
  const selectedOrgUid = searchParams.get('orgUid');

  useEffect(() => {
    setTimeout(() => {
      dispatch(
        getExplorerData({
          page,
          resultsLimit: constants.TABLE_ROWS,
          isRequestMocked: false,
          searchQuery: searchOptions.query,
          searchSource: searchOptions.filter,
          orgUid: selectedOrgUid,
        }),
      );
    }, 100);
  }, [page, searchOptions, searchParams]);

  useEffect(() => {
    if (pageContainerRef && pageContainerRef.current) {
      setModalSizeAndPosition({
        left: pageContainerRef.current.getBoundingClientRect().x,
        top: pageContainerRef.current.getBoundingClientRect().y,
        width: pageContainerRef.current.getBoundingClientRect().width,
        height: pageContainerRef.current.getBoundingClientRect().height,
      });
    }
  }, [
    pageContainerRef,
    pageContainerRef.current,
    windowSize.height,
    windowSize.width,
  ]);

  const keysToDisplay = useMemo(
    () => [
      'icon',
      'registry_project_id',
      'project_name',
      'vintage_year',
      'action',
      'quantity',
      'timestamp_UTC',
      'beneficiary_name',
      'beneficiary_key',
    ],
    [],
  );

  const explorerDataTableConfig = useMemo(
    () => ({
      rows: {
        onRowClick: entry => setUnitToBeViewed(entry),
      },
      columns: [
        {
          title: '',
          key: 'icon',
          type: TableColumnTypeEnum.image,
          isTooltipVisible: false,
        },
        {
          title: 'Registry Project Id',
          key: 'registry_project_id',
          type: TableColumnTypeEnum.string,
          isTooltipVisible: true,
        },
        {
          title: 'Project Name',
          key: 'project_name',
          type: TableColumnTypeEnum.string,
          isTooltipVisible: true,
        },
        {
          title: 'Vintage Year',
          key: 'vintage_year',
          type: TableColumnTypeEnum.string,
        },
        {
          title: 'Action',
          key: 'action',
          type: TableColumnTypeEnum.pill,
          pillColorConfig: {
            RETIREMENT: 'error',
            TOKENIZATION: 'success',
            DETOKENIZATION: 'primary',
          },
        },
        {
          title: 'Quantity',
          key: 'quantity',
          type: TableColumnTypeEnum.quantity,
        },
        {
          title: 'Timestamp UTC',
          key: 'timestamp_UTC',
          type: TableColumnTypeEnum.date,
        },
      ],
    }),
    [],
  );

  const updateSearchOptionsDebounced = useMemo(
    () =>
      _.debounce(
        (search, filter) =>
          setSearchOptions({
            query: search.toLowerCase(),
            filter: filter,
          }),
        300,
      ),
    [],
  );

  useEffect(() => {
    return () => {
      updateSearchOptionsDebounced.cancel();
    };
  }, []);

  const onSearchChange = (search, filter) => {
    setSearchQuery(search);
    setSearchFilter(filter);
    updateSearchOptionsDebounced(search, filter.value);
  };

  return (
    <>
      <StyledSectionContainer ref={pageContainerRef}>
        <StyledHeaderContainer>
          <SearchInputWithFilters
            searchQuery={searchQuery}
            searchFilter={searchFilter}
            filterOptions={filterOptions}
            placeholder="Search ..."
            onChange={onSearchChange}
          />
        </StyledHeaderContainer>

        <StyledBodyContainer>
          {explorerData?.length > 0 ? (
            <Table
              config={explorerDataTableConfig}
              data={explorerData}
              changePageTo={page => setPage(page)}
              currentPage={page}
              numberOfPages={paginationNrOfPages}
            />
          ) : (
            <NoDataMessageContainer>
              <H3>
                <FormattedMessage id="no-explorer-data" />
              </H3>
            </NoDataMessageContainer>
          )}
        </StyledBodyContainer>
      </StyledSectionContainer>
      {unitToBeViewed && (
        <UnitDetailedView
          onClose={() => setUnitToBeViewed(null)}
          modalSizeAndPosition={modalSizeAndPosition}
          unit={unitToBeViewed}
          keysToDisplay={keysToDisplay}
        />
      )}
    </>
  );
};

export { RetirementExplorerPage };
