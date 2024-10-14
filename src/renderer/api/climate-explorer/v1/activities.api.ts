import { climateExplorerApi, RECORDS_PER_PAGE } from './index';
import { Activity } from '@/schemas/Activity.schema';

interface GetActivitiesParams {
  page?: number;
  search?: string | null;
  sort?: string | null;
}

interface GetActivityRecordParams {
  warehouseUnitId: string;
  assetTokenId: string;
  actionMode: ClimateActionMode;
}

interface GetActivityRecordExplorerQueryParams {
  cw_unit_id: string;
  asset_token_id: string;
  action_mode: ClimateActionMode;
}

export interface ClimateActionMode {
  actionMode: 'TOKENIZATION' | 'DETOKENIZATION' | 'PERMISSIONLESS_RETIREMENT';
}

interface GetActivitiesResponse {
  activities: Activity[];
  total: number;
}

const activityApi = climateExplorerApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<GetActivitiesResponse, GetActivitiesParams>({
      query: ({ page, search, sort }: GetActivitiesParams) => {
        // Initialize the params object with page and limit
        const params: GetActivitiesParams & { limit: number } = { page, limit: RECORDS_PER_PAGE };

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

    getActivityRecord: builder.query<Activity | undefined, GetActivityRecordParams>({
      query: ({ warehouseUnitId, actionMode, assetTokenId }) => {
        const params: GetActivityRecordExplorerQueryParams = {
          cw_unit_id: warehouseUnitId,
          action_mode: actionMode,
          asset_token_id: assetTokenId,
        };

        return {
          url: `/v1/activities/activity-record`,
          params,
          method: 'GET',
        };
      },
      transformResponse(baseQueryReturnValue: any): Activity | undefined {
        return baseQueryReturnValue?.activity || undefined;
      },
    }),
  }),
});

export const { useGetActivitiesQuery, useGetActivityRecordQuery } = activityApi;
