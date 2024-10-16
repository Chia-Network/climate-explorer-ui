import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface QueryParamState<T> {
  (name: string, defaultValue?: T): [T, (value: T) => void];
}

const useQueryParamState: QueryParamState<string> = (name, defaultValue = '') => {
  const [param, setParam] = useState<string>();
  const location = useLocation();

  const setQueryStringParameter = useCallback(
    (value?: string) => {
      const params = new URLSearchParams(window.location.search || window.location.hash.replace(/#.*\?/, ''));

      if (_.isNil(value) || value === '') {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      const newPath = params.toString() ? `${window.location.pathname}?${params}` : window.location.pathname;

      window.history.pushState({}, '', decodeURIComponent(`${newPath}${window.location.hash}`));
      setParam(value);
    },
    [name, location],
  );

  const value = useMemo(() => {
    const params = new URLSearchParams(window.location.search || window.location.hash.replace(/#.*\?/, ''));
    return params.get(name) || defaultValue;
  }, [name, location, param, defaultValue]);

  // Ensure default value is set in URL on initial mount if it's missing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search || window.location.hash.replace(/#.*\?/, ''));
    if (!params.has(name) && defaultValue) {
      setQueryStringParameter(defaultValue);
    }
  }, [name, defaultValue, setQueryStringParameter]);

  return [value, setQueryStringParameter];
};

export { useQueryParamState };
