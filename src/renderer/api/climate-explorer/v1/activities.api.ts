import { climateExplorerApi, RECORDS_PER_PAGE } from './index';
import { Activity } from '@/schemas/Activity.schema';

interface GetActivityParams {
  page?: number;
  search?: string | null;
  sort?: string | null;
}

interface GetActivitiesResponse {
  activities: Activity[];
  total: number;
}

const activityApi = climateExplorerApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<GetActivitiesResponse, GetActivityParams>({
      query: ({ page, search, sort }: GetActivityParams) => {
        // Initialize the params object with page and limit
        const params: GetActivityParams & { limit: number } = { page, limit: RECORDS_PER_PAGE };

        if (search) {
          params.search = search.replace(/[^a-zA-Z0-9 _.-]+/, '');
        }

        if (sort) {
          params.sort = sort;
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
        const params = { page: 1, limit: 1, cw_unit_id: warehouseUnitId };

        return {
          url: `/v1/activities/by-cw-unit-id`,
          params,
          method: 'GET',
        };
      },
    }),
  }),
});

export const { useGetActivitiesQuery, useGetActivityByWarehouseUnitIdQuery } = activityApi;
