export type MatchResult = "MATCH" | "DIFFERENCE" | "NOT_FOUND";

export type VehicleSubFieldsMatch = {
  vin?: MatchResult;
  garageZip?: MatchResult;
  description?: MatchResult;
  vehicleCost?: MatchResult;
  vehiclePremium?: MatchResult;
  collisionDeductible?: MatchResult;
  comprehensiveDeductible?: MatchResult;
};

export type VehicleDetails = {
  vin?: string;
  garageZip?: string;
  description?: string;
  vehicleCost?: string;
  vehiclePremium?: string;
  collisionDeductible?: string;
  comprehensiveDeductible?: string;
};

export type PolicyComparisonData = {
  summary: string;
  fileName1: string;
  fileName2: string;
  matchResult: MatchResult[];
  subFieldsMatchResult: VehicleSubFieldsMatch[];
  rawList1: VehicleDetails[];
  rawList2: VehicleDetails[];
};
