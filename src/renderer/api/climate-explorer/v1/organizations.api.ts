import { climateExplorerApi } from './index';
// @ts-ignore
import { BaseQueryResult } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { Organization } from '@/schemas/Organization.schema';

interface GetOrgnaizationsMapResponse {
  [index: string]: Organization;
}

const organizationsApi = climateExplorerApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationsList: builder.query<Organization[], void | null>({
      query: () => ({
        url: `/v1/organizations`,
        method: 'GET',
      }),
      transformResponse(baseQueryReturnValue: BaseQueryResult<Organization[]>): Organization[] {
        return Object.values(baseQueryReturnValue);
      },
    }),

    getOrganizationsMap: builder.query<GetOrgnaizationsMapResponse, void | null>({
      query: () => ({
        url: `/v1/organizations`,
        method: 'GET',
      }),
    }),
  }),
});

export const invalidateOrgApiTag = organizationsApi.util.invalidateTags;

export const { useGetOrganizationsListQuery, useGetOrganizationsMapQuery } = organizationsApi;
