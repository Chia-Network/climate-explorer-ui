import _ from 'lodash';

const buildAPIHost = process.env.REACT_APP_API_HOST;
const hostName = String(_.get(window, 'location.hostname', ''));
const protocol = String(_.get(window, 'location.protocol', 'http'));

let apiHost;

if (!_.isEmpty(buildAPIHost)) {
  apiHost = buildAPIHost;
} else {
  apiHost =
    _.isEmpty(hostName) || hostName.includes('localhost')
      ? 'http://127.0.0.1:31313/v1'
      : `${protocol}//${hostName}/v1`;
}

export default {
  // if running locally use localhost api, otherwise use observer node api
  API_HOST: apiHost,
  HEADER_HEIGHT: 64, // Needed to be used to calculate max height for body components,
  TABLE_ROWS: 7,
  THEME: {
    DEFAULT: 'default',
  },
  ROUTES: {
    retirementExplorer: '/retirement-explorer',
  },
};
