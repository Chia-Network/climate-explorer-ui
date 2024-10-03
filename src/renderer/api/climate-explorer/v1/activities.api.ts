import { climateExplorerApi, RECORDS_PER_PAGE } from './index';
import { Activity } from '@/schemas/Activity.schema';

interface GetActivityParams {
  page?: number;
  search?: string | null;
  order?: string | null;
}

interface GetActivityResponse {
  activities: Activity[];
  total: number;
}

const activityApi = climateExplorerApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<GetActivityResponse, GetActivityParams>({
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
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetActivitiesQuery } = activityApi;
