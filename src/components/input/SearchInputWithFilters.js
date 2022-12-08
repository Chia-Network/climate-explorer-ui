import React from 'react';
import styled, { withTheme } from 'styled-components';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SearchContainer = styled('div')`
  font-family: ${props => props.theme.typography.primary.regular};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  border: 1px solid ${props => props.theme.colors.default.gray3};
  border-radius: 0.1rem;
`;

const StyledInput = styled('input')`
  border: none;
  padding-left: 1rem;
  font-family: ${props => props.theme.typography.primary.regular};
  color: ${props => props.theme.colors.default.secondary};
  font-size: 16px;
  :focus {
    outline: none;
  }
`;

const StyledSelect = styled(Select)`
  .MuiOutlinedInput-notchedOutline {
    outline: none;
    border: none;
    border-radius: 0%;
  }

  .MuiSelect-select,
  .MuiSelect-icon {
    color: ${props => props.theme.colors.default.onButton};
    font-family: ${props => props.theme.typography.primary.regular};
    font-size: 16px;
    background-color: ${props => props.theme.colors.default.primaryDark};
  }
`;

const SearchInputWithFilters = withTheme(
  ({ searchQuery, searchFilter, filterOptions, placeholder, onChange }) => {
    const onFilterChange = event => {
      const newFilterValue = event.target.value;
      const newFilter = filterOptions.find(
        filterItem => filterItem.value === newFilterValue,
      );
      onChange(searchQuery, newFilter);
    };

    const onInputChange = event => {
      onChange(event.target.value, searchFilter);
    };

    return (
      <SearchContainer>
        <FormControl fullWidth size="small">
          <StyledSelect
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={searchFilter.value}
            onChange={onFilterChange}
          >
            {filterOptions.map(filter => (
              <MenuItem value={filter.value} key={filter.value}>
                {filter.label}
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>

        <StyledInput
          type="text"
          value={searchQuery}
          onChange={onInputChange}
          placeholder={placeholder}
        />
      </SearchContainer>
    );
  },
);

export { SearchInputWithFilters };
