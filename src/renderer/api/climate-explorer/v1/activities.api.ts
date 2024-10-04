import { climateExplorerApi, RECORDS_PER_PAGE } from './index';
import { Activity } from '@/schemas/Activity.schema';
//@ts-ignore
import { BaseQueryResult } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

interface GetActivityParams {
  page?: number;
  search?: string | null;
  order?: string | null;
}

interface GetActivitiesResponse {
  activities: Activity[];
  total: number;
}

const activityApi = climateExplorerApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<GetActivitiesResponse, GetActivityParams>({
      query: ({ page, search, order }: GetActivityParams) => {
        // Initialize the params object with page and limit
        const params: GetActivityParams & { limit: number } = { page, limit: RECORDS_PER_PAGE };

        if (search) {
          params.search = search.replace(/[^a-zA-Z0-9 _.-]+/, '');
        }

        if (order) {
          params.order = order;
        }

        return {
          url: `/v1/activities`,
          params,
          method: 'GET',
        };
      },
      keepUnusedDataFor: 600,
    }),

    getActivityByWarehouseUnitId: builder.query<Activity | undefined, string>({
      query: (warehouseUnitId) => {
        // Initialize the params object with page and limit
        const params = { page: 1, limit: 1, search: warehouseUnitId };

        return {
          url: `/v1/activities`,
          params,
          method: 'GET',
        };
      },
      transformResponse(
        baseQueryReturnValue: BaseQueryResult<GetActivitiesResponse>,
        _,
        arg: string,
      ): Promise<Activity | undefined> | Activity | undefined {
        try {
          const returnedWarehouseUnitId: string | null =
            baseQueryReturnValue?.activities?.[0]?.cw_unit?.warehouseUnitId;
          console.log('^^^^^^^ returned', returnedWarehouseUnitId, 'requested', arg);
          if (returnedWarehouseUnitId === arg) {
            return baseQueryReturnValue.activities[0];
          }
          return undefined;
        } catch (error) {
          return undefined;
        }
      },
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetActivitiesQuery, useGetActivityByWarehouseUnitIdQuery } = activityApi;
