import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DropdownItem } from 'flowbite-react';
import { Dropdown } from '@/components';
import { ActivitySearchBy } from '@/api';
import { SEARCH_BY_CLIMATE_DATA, SEARCH_BY_ON_CHAIN_METADATA } from '@/utils/constants';

interface ActivitiesSearchByDropDownProps {
  searchByString: ActivitySearchBy;
  setSearchByString: (searchByString: ActivitySearchBy) => void;
}

const ActivitiesSearchByDropDown: React.FC<ActivitiesSearchByDropDownProps> = ({
  searchByString,
  setSearchByString,
}) => {
  return (
    <Dropdown
      label={
        searchByString === SEARCH_BY_ON_CHAIN_METADATA ? (
          <p className="capitalize">
            <FormattedMessage id="search-by-beneficiary-information" />
          </p>
        ) : (
          <p className="capitalize">
            <FormattedMessage id="search-by-climate-data" />
          </p>
        )
      }
    >
      <DropdownItem onClick={() => setSearchByString(SEARCH_BY_CLIMATE_DATA)}>
        <p className="capitalize">
          <FormattedMessage id="search-by-climate-data" />
        </p>
      </DropdownItem>
      <DropdownItem onClick={() => setSearchByString(SEARCH_BY_ON_CHAIN_METADATA)}>
        <p className="capitalize">
          <FormattedMessage id="search-by-beneficiary-information" />
        </p>
      </DropdownItem>
    </Dropdown>
  );
};

export { ActivitiesSearchByDropDown };
