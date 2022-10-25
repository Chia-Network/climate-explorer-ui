import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { H3, DataTable, SearchInput } from '../components';
import { getExplorerData } from '../store/actions/appActions';
import constants from '../constants';

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

// const StyledFiltersContainer = styled('div')`
//   margin: 0rem 1.2813rem;
// `;

const StyledBodyContainer = styled('div')`
  flex-grow: 1;
`;

const NoDataMessageContainer = styled('div')`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const RetirementExplorerPage = () => {
  const dispatch = useDispatch();

  const pageContainerRef = useRef(null);
  const [page, setPage] = useState(0);
  const { explorerData, paginationNrOfPages } = useSelector(store => store);

  useEffect(() => {
    dispatch(
      getExplorerData({
        page: page,
        resultsLimit: constants.TABLE_ROWS,
        isRequestMocked: false,
      }),
    );
  }, [page]);

  const explorerDataKeysToBeDisplayed = useMemo(
    () => [
      'org_uid',
      'warehouse_project_id',
      'vintage_year',
      'sequence_num',
      'asset_id',
      'beneficiary_name',
    ],
    [],
  );

  return (
    <>
      <StyledSectionContainer ref={pageContainerRef}>
        <StyledHeaderContainer>
          <StyledSearchContainer>
            <SearchInput
              size="large"
              onChange={() => console.log('search')}
              outline
            />
          </StyledSearchContainer>

          {/* <StyledFiltersContainer>
            <SelectCreatable
              options={['Ken', 'Craig', 'Michael']}
              selected={'Craig'}
              onChange={val => console.log(val)}
            />
          </StyledFiltersContainer> */}
        </StyledHeaderContainer>

        <StyledBodyContainer>
          {explorerData?.length > 0 ? (
            <DataTable
              headings={explorerDataKeysToBeDisplayed}
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
    </>
  );
};

export { RetirementExplorerPage };
