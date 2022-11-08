import _ from 'lodash';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  H3,
  DataTable,
  SearchInput,
  SelectCreatable,
  UnitDetailedView,
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

const StyledSearchContainer = styled('div')`
  max-width: 25.1875rem;
`;

const StyledFiltersContainer = styled('div')`
  margin: 0rem 1.2813rem;
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

const searchByOptions = [
  { value: 'climate_warehouse', label: 'Climate Warehouse' },
  { value: 'onchain_metadata', label: 'Onchain Metadata' },
];

const RetirementExplorerPage = () => {
  const dispatch = useDispatch();
  const [searchSource, setSearchSource] = useState(searchByOptions[0].value);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalSizeAndPosition, setModalSizeAndPosition] = useState(null);
  const pageContainerRef = useRef(null);
  const [page, setPage] = useState(0);
  const { explorerData, paginationNrOfPages } = useSelector(store => store);
  const windowSize = useWindowSize();
  const [unitToBeViewed, setUnitToBeViewed] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      dispatch(
        getExplorerData({
          page: page,
          resultsLimit: constants.TABLE_ROWS,
          isRequestMocked: false,
          searchQuery,
          searchSource,
        }),
      );
    }, 100);
  }, [page, searchQuery, searchSource]);

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

  const explorerDataKeysToBeDisplayed = useMemo(
    () => [
      'icon',
      'registry_project_id',
      'project_name',
      'vintage_year',
      'action',
      'quantity',
      'datetime',
    ],
    [],
  );

  const onSearch = useMemo(
    () =>
      _.debounce(event => {
        setSearchQuery(event.target.value?.toLowerCase() ?? '');
      }, 300),
    [],
  );

  useEffect(() => {
    return () => {
      onSearch.cancel();
    };
  }, []);

  const convertSearchByValueToLabel = value => {
    const foundItem = searchByOptions.find(item => item.value === value);
    return foundItem.label;
  };

  return (
    <>
      <StyledSectionContainer ref={pageContainerRef}>
        <StyledHeaderContainer>
          <StyledSearchContainer>
            <SearchInput size="large" onChange={onSearch} outline />
          </StyledSearchContainer>

          <StyledFiltersContainer>
            <SelectCreatable
              options={searchByOptions}
              selected={convertSearchByValueToLabel(searchSource)}
              onChange={val => setSearchSource(val)}
              isClearable={false}
            />
          </StyledFiltersContainer>
        </StyledHeaderContainer>

        <StyledBodyContainer>
          {explorerData?.length > 0 ? (
            <DataTable
              headings={explorerDataKeysToBeDisplayed}
              data={explorerData}
              changePageTo={page => setPage(page)}
              currentPage={page}
              numberOfPages={paginationNrOfPages}
              onRowClick={entry => setUnitToBeViewed(entry)}
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
        />
      )}
    </>
  );
};

export { RetirementExplorerPage };
