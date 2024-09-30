export interface Token {
  org_uid: string;
  warehouse_project_id: string;
  vintage_year: number;
  sequence_num: number;
  index: string; // Hex string for bytes
  public_key: string; // Hex string for bytes
  asset_id: string; // Hex string for bytes
  tokenization?: {
    mod_hash: string; // Hex string for bytes
    public_key: string; // Hex string for bytes
  };
  detokenization?: {
    mod_hash: string; // Hex string for bytes
    public_key: string; // Hex string for bytes
    signature: string; // Hex string for bytes
  };
  permissionless_retirement?: {
    mod_hash: string; // Hex string for bytes
    signature: string; // Hex string for bytes
  };
}
