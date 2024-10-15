import { climateExplorerApi, RECORDS_PER_PAGE } from './index';
import { Activity } from '@/schemas/Activity.schema';

// see https://github.com/Chia-Network/climate-token-driver/blob/develop/app/schemas/activity.py
export type ActivitySearchBy = 'onchain_metadata' | 'climate_warehouse';

interface GetActivitiesParams {
  page: number;
  search?: string | null;
  searchBy?: ActivitySearchBy;
  sort?: 'desc' | 'asc' | string | null;
}

// query parameter names the explorer api is expecting
interface GetActivitiesExplorerQueryParams {
  search?: string;
  search_by?: ActivitySearchBy;
  minHeight?: number;
  mode?: ClimateActionMode;
  page: number;
  limit: number;
  sort?: 'desc' | 'asc';
}

interface GetActivityRecordParams {
  warehouseUnitId: string;
  coinId: string;
  actionMode: ClimateActionMode;
}

// query parameter names the explorer api is expecting
interface GetActivityRecordExplorerQueryParams {
  cw_unit_id: string;
  coin_id: string;
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
      query: ({ page, search, sort, searchBy }: GetActivitiesParams) => {
        const params: GetActivitiesExplorerQueryParams = {
          page,
          limit: RECORDS_PER_PAGE,
        };

        if (sort) {
          params.sort =
            sort?.toLowerCase() === 'asc' || sort?.toLowerCase() === 'desc' ? (sort as 'asc' | 'desc') : 'desc';
        }

        if (search) {
          params.search = search.replace(/[^a-zA-Z0-9 _.-]+/, '');
          params.search_by = searchBy;
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
      query: ({ warehouseUnitId, actionMode, coinId }) => {
        const params: GetActivityRecordExplorerQueryParams = {
          cw_unit_id: warehouseUnitId,
          action_mode: actionMode,
          coin_id: coinId,
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
