import { NextResponse } from "next/server";
import type { PolicyComparisonData } from "~/lib/types";

export async function POST() {
  // does workflow processing here
  const comparisonData: PolicyComparisonData = {
    summary: "Five vehicles listed; two descriptions differ slightly. Notable",
    fileName1: "2024 Policy.pdf",
    fileName2: "2025 Policy.pdf",
    matchResult: [
      "MATCH",
      "MATCH",
      "DIFFERENCE",
      "DIFFERENCE",
      "DIFFERENCE",
      "DIFFERENCE",
    ],
    subFieldsMatchResult: [
      {
        vin: "MATCH",
        garageZip: "MATCH",
        description: "MATCH",
        vehicleCost: "MATCH",
        vehiclePremium: "MATCH",
        collisionDeductible: "MATCH",
        comprehensiveDeductible: "MATCH",
      },
      {
        vin: "MATCH",
        garageZip: "MATCH",
        description: "MATCH",
        vehicleCost: "MATCH",
        vehiclePremium: "NOT_FOUND",
        collisionDeductible: "MATCH",
        comprehensiveDeductible: "MATCH",
      },
      {
        vin: "MATCH",
        garageZip: "MATCH",
        description: "MATCH",
        vehicleCost: "MATCH",
        vehiclePremium: "NOT_FOUND",
        collisionDeductible: "MATCH",
        comprehensiveDeductible: "MATCH",
      },
      {
        vin: "MATCH",
        garageZip: "MATCH",
        description: "MATCH",
        vehicleCost: "MATCH",
        vehiclePremium: "NOT_FOUND",
        collisionDeductible: "MATCH",
        comprehensiveDeductible: "MATCH",
      },
      {},
      {},
    ],
    rawList1: [
      {
        vin: "3C7WDKCL5CG143075",
        garageZip: "93230",
        description: "2012 DODGE RAM 4500 ST",
        vehicleCost: "$45,000.00",
        vehiclePremium: "$1,798.00",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
      {
        vin: "3C6URVJG7KE545937",
        garageZip: "93230",
        description: "2019 RAM PROMASTER 3500 3500",
        vehicleCost: "$45,000.00",
        vehiclePremium: "$2,091.00",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
      {
        vin: "3C6URVJG6KE537263",
        garageZip: "93230",
        description: "2019 RAM PROMASTER 3500 3500",
        vehicleCost: "$45,000.00",
        vehiclePremium: "$2,091.00",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
      {
        vin: "3ALACWDT8FDGK0234",
        garageZip: "93230",
        description: "2015 FREIGHTLINER M2 106 MEDIUM DUTY",
        vehicleCost: "$97,294.00",
        vehiclePremium: "$2,787.00",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
      {
        vin: "4HXBH1225LC214183",
        garageZip: "93230",
        description: "2015 CARSON ENCLOSED TRAILER",
        vehicleCost: "$8,000.00",
        vehiclePremium: "$230.00",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
      {},
    ],
    rawList2: [
      {
        vin: "3C7WDKCL5CG143075",
        garageZip: "93230",
        description: "2012 Dodge 450 w/Box",
        vehicleCost: "$45,000",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
      {
        vin: "3C6URVJG7KE545937",
        garageZip: "93230",
        description: "2019 Dodge Promaster 3500",
        vehicleCost: "$45,000",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
      {
        vin: "3C6URVJG6KE537263",
        garageZip: "93230",
        description: "2019 Dodge Promaster 3500",
        vehicleCost: "45000",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
      {
        vin: "3ALACWDT8FDGK0234",
        garageZip: "93230",
        description: "2015 Freightliner M2",
        vehicleCost: "$97,294",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
      {},
      {
        vin: "4HXBH1225LC214184",
        garageZip: "93230",
        description: "2015 Carson Enclosed trailer Trailer",
        vehicleCost: "$8,000",
        collisionDeductible: "$1,000",
        comprehensiveDeductible: "$1,000",
      },
    ],
  };

  // wait 2 secs
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json(comparisonData);
}
