export interface Token {
  org_uid: string;
  warehouse_project_id: string;
  vintage_year: number;
  sequence_num: number;
  index: string;
  public_key: string;
  asset_id: string;
  tokenization?: {
    mod_hash: string;
    public_key: string;
  };
  detokenization?: {
    mod_hash: string;
    public_key: string;
    signature: string;
  };
  permissionless_retirement?: {
    mod_hash: string;
    signature: string;
  };
}
