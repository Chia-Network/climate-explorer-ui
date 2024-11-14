import { climateExplorerApi } from './index';
// @ts-ignore
import { BaseQueryResult } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import _ from 'lodash';

export interface Health {
  message: string;
  timestamp: string;
}

interface GetHealthParams {
  apiHost?: string;
  apiKey?: string;
}

interface ServerHealth {
  isHealthy: boolean;
}

export interface Config {
  apiHost?: string;
}

const systemApi = climateExplorerApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: builder.query<ServerHealth, GetHealthParams>({
      query: ({ apiHost = '', apiKey }) => ({
        url: `${apiHost}/v1/info`,
        method: 'GET',
        headers: apiKey ? { 'X-Api-Key': apiKey } : {},
      }),
      transformResponse: (response: BaseQueryResult<Health>): ServerHealth => {
        return { isHealthy: Boolean(response?.blockchain_name) };
      },
      keepUnusedDataFor: 0,
    }),
    getHealthImmediate: builder.mutation<boolean, GetHealthParams>({
      query: ({ apiHost = '', apiKey }) => ({
        url: `${apiHost}/v1/info`,
        method: 'GET',
        headers: apiKey ? { 'X-Api-Key': apiKey } : {},
      }),
      transformResponse(baseQueryReturnValue: BaseQueryResult<Health>): boolean {
        return Boolean(baseQueryReturnValue?.blockchain_name);
      },
    }),
    getUiConfig: builder.query<Config | undefined, void>({
      query: () => ({
        url: `config.json`,
        method: 'GET',
      }),
      transformResponse(baseQueryReturnValue: BaseQueryResult<Config>): Config | undefined {
        if (_.isEmpty(baseQueryReturnValue) || _.isNil(baseQueryReturnValue)) {
          return undefined;
        }
        return baseQueryReturnValue;
      },
    }),
    getThemeColors: builder.query<any, void>({
      query: () => ({
        url: `colors.json`,
        method: 'GET',
      }),
      transformResponse(baseQueryReturnValue: BaseQueryResult<any>): any {
        if (_.isEmpty(baseQueryReturnValue) || _.isNil(baseQueryReturnValue)) {
          return undefined;
        }
        return baseQueryReturnValue;
      },
    }),
  }),
});

export const { useGetHealthQuery, useGetHealthImmediateMutation, useGetUiConfigQuery, useGetThemeColorsQuery } =
  systemApi;
