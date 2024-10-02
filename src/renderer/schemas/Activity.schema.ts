import { Unit } from '@/schemas/Unit.schema';
import { Organization } from '@/schemas/Organization.schema';
import { Project } from '@/schemas/Project.schema';
import { Token } from '@/schemas/Token.schema';

export interface Activity {
  metadata: any;
  beneficiary_name?: string;
  beneficiary_address?: string;
  beneficiary_puzzle_hash?: string;
  coin_id: string;
  height: number;
  amount: number;
  mode: string;
  timestamp: number;
  token: Token;
  cw_unit: Unit;
  cw_org: Organization;
  cw_project: Project;
}
