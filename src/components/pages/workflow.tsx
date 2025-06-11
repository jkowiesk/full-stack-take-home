"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Play,
  FileText,
  Building2,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { api } from "~/trpc/react";
import AccountsCard from "~/components/accountsCard";

type MatchResult = "MATCH" | "DIFFERENCE" | "NOT_FOUND";

interface VehicleSubFieldsMatch {
  vin?: MatchResult;
  garageZip?: MatchResult;
  description?: MatchResult;
  vehicleCost?: MatchResult;
  vehiclePremium?: MatchResult;
  collisionDeductible?: MatchResult;
  comprehensiveDeductible?: MatchResult;
}

interface VehicleDetails {
  vin?: string;
  garageZip?: string;
  description?: string;
  vehicleCost?: string;
  vehiclePremium?: string;
  collisionDeductible?: string;
  comprehensiveDeductible?: string;
}

interface PolicyComparisonData {
  summary: string;
  fileName1: string;
  fileName2: string;
  matchResult: MatchResult[];
  subFieldsMatchResult: VehicleSubFieldsMatch[];
  rawList1: VehicleDetails[];
  rawList2: VehicleDetails[];
}

const getMatchIcon = (match: MatchResult) => {
  switch (match) {
    case "MATCH":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "DIFFERENCE":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "NOT_FOUND":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
};

const getMatchBadgeVariant = (match: MatchResult) => {
  switch (match) {
    case "MATCH":
      return "success";
    case "DIFFERENCE":
      return "destructive";
    case "NOT_FOUND":
      return "secondary";
    default:
      return "outline";
  }
};

export function WorkflowPage() {
  const { data: allAccounts = [] } =
    api.userAccount.getAllUserAccounts.useQuery();

  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    allAccounts[0]?.id ?? "",
  );
  const {
    data: documents = [],
    isLoading: loadingDocuments,
    refetch: refetchDocuments,
  } = api.document.getDocumentByAccountId.useQuery(
    { accountId: selectedAccountId },
    { enabled: !!selectedAccountId },
  );

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowResult, setWorkflowResult] =
    useState<PolicyComparisonData | null>(null);

  const selectedAccount = allAccounts.find(
    (acc) => acc.id === selectedAccountId,
  );

  // Clear selected documents when account changes
  useEffect(() => {
    setSelectedDocuments([]);
    setWorkflowResult(null);
  }, [selectedAccountId]);

  const handleDocumentSelection = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments((prev) => [...prev, documentId]);
    } else {
      setSelectedDocuments((prev) => prev.filter((id) => id !== documentId));
    }
  };

  const runWorkflow = async () => {
    if (selectedDocuments.length === 0) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: selectedAccountId,
          documentIds: selectedDocuments,
        }),
      });

      if (!response.ok) {
        throw new Error("Workflow failed");
      }

      const result: PolicyComparisonData = await response.json();
      setWorkflowResult(result);
    } catch (error) {
      console.error("Workflow failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const canRunWorkflow = selectedDocuments.length > 0 && !isProcessing;

  useEffect(() => {
    if (selectedAccountId) {
      void refetchDocuments();
    }
  }, [selectedAccountId, refetchDocuments]);

  // Get all unique field names for the table headers
  const fieldNames = [
    "vin",
    "garageZip",
    "description",
    "vehicleCost",
    "vehiclePremium",
    "collisionDeductible",
    "comprehensiveDeductible",
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Account Context Info */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={runWorkflow}
              disabled={!canRunWorkflow}
              size="sm"
              className="relative h-8 w-full cursor-pointer 2xl:absolute 2xl:top-2 2xl:-right-24 2xl:grid 2xl:h-16 2xl:w-16 2xl:place-items-center"
            >
              {isProcessing ? (
                <Loader2 className="h-16 w-16 animate-spin" />
              ) : (
                <Play className="h-16 w-16" />
              )}
              <span className="2xl:hidden">Run Policy Comparison Workflow</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Compare vehicle policies between selected documents and identify
              differences
            </p>
          </TooltipContent>
        </Tooltip>
        <AccountsCard
          accounts={allAccounts}
          currentAccount={selectedAccount}
          onAccountSelect={async (id) => {
            setSelectedAccountId(id);
          }}
        />

        {/* Document Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Choose Documents for Comparison
            </CardTitle>
            <CardDescription>
              Select files from{" "}
              <span className="text-primary font-semibold">
                {selectedAccount?.name}
              </span>{" "}
              to execute the policy comparison analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 space-y-3 overflow-y-auto">
            {loadingDocuments ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading documents...
              </div>
            ) : documents.length === 0 ? (
              <p className="text-sm text-gray-500">
                No documents available for this account
              </p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={doc.id}
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={(checked) =>
                      handleDocumentSelection(doc.id, checked as boolean)
                    }
                  />
                  <label htmlFor={doc.id} className="flex-1 cursor-pointer">
                    <div className="text-sm font-medium">
                      {doc.originalName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB •
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                  </label>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {(workflowResult || isProcessing) && (
          <div className="space-y-6">
            {/* Combined Policy Comparison Card */}
            <Card>
              <CardHeader>
                <CardTitle>Policy Comparison Results</CardTitle>
                <CardDescription>
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Processing documents...
                    </div>
                  ) : (
                    `Comparing ${workflowResult?.fileName1} vs ${workflowResult?.fileName2}`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isProcessing ? (
                  // Loading Skeleton
                  <>
                    {/* Summary Skeleton */}
                    <div>
                      <div className="mb-2 h-6 w-20 animate-pulse rounded bg-gray-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>

                    {/* Table Skeleton */}
                    <div>
                      <div className="mb-4 h-6 w-52 animate-pulse rounded bg-gray-200"></div>
                      <div className="overflow-x-auto">
                        <div className="min-w-full">
                          {/* Table Header Skeleton */}
                          <div className="mb-4 border-b border-gray-200 pb-2">
                            <div className="flex gap-4">
                              <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                              <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                              {fieldNames.map((field, index) => (
                                <div
                                  key={index}
                                  className="h-4 w-32 animate-pulse rounded bg-gray-200"
                                ></div>
                              ))}
                            </div>
                          </div>

                          {/* Table Rows Skeleton */}
                          {[1, 2, 3].map((row) => (
                            <div
                              key={row}
                              className="border-b border-gray-100 py-4"
                            >
                              <div className="flex items-start gap-4">
                                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                                <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
                                {fieldNames.map((field, index) => (
                                  <div key={index} className="w-32 space-y-2">
                                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                                    <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                                    <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                                    <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Actual Content
                  <>
                    {/* Summary Section */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-semibold">
                        Vehicle Details Comparison
                      </h3>
                      <p className="text-sm">
                        <span className="text-foreground/50">Summary: </span>
                        {workflowResult?.summary}
                      </p>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">Vehicle</TableHead>
                              <TableHead className="w-20">Status</TableHead>
                              {fieldNames.map((field) => (
                                <TableHead key={field} className="min-w-32">
                                  {field
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workflowResult?.rawList1.map((vehicle1, index) => {
                              const vehicle2 = workflowResult.rawList2[index];
                              const matchResult =
                                workflowResult.matchResult[index];
                              const subFieldsMatch =
                                workflowResult.subFieldsMatchResult[index];

                              return (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    #{index + 1}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      {getMatchIcon(matchResult!)}
                                      <Badge
                                        variant={getMatchBadgeVariant(
                                          matchResult!,
                                        )}
                                      >
                                        {matchResult}
                                      </Badge>
                                    </div>
                                  </TableCell>
                                  {fieldNames.map((field) => (
                                    <TableCell key={field}>
                                      <div className="space-y-2">
                                        {/* File 1 Value */}
                                        <div className="text-xs font-medium text-gray-600">
                                          {workflowResult.fileName1}:
                                        </div>
                                        <div className="text-sm">
                                          {vehicle1?.[
                                            field as keyof VehicleDetails
                                          ] ?? "N/A"}
                                        </div>

                                        {/* File 2 Value */}
                                        <div className="text-xs font-medium text-gray-600">
                                          {workflowResult.fileName2}:
                                        </div>
                                        <div className="text-sm">
                                          {vehicle2?.[
                                            field as keyof VehicleDetails
                                          ] ?? "N/A"}
                                        </div>

                                        {/* Match Status */}
                                        {subFieldsMatch?.[
                                          field as keyof VehicleSubFieldsMatch
                                        ] && (
                                          <div className="flex items-center gap-1">
                                            {getMatchIcon(
                                              subFieldsMatch[
                                                field as keyof VehicleSubFieldsMatch
                                              ]!,
                                            )}
                                            <Badge
                                              variant={getMatchBadgeVariant(
                                                subFieldsMatch[
                                                  field as keyof VehicleSubFieldsMatch
                                                ]!,
                                              )}
                                              className="text-xs"
                                            >
                                              {
                                                subFieldsMatch[
                                                  field as keyof VehicleSubFieldsMatch
                                                ]
                                              }
                                            </Badge>
                                          </div>
                                        )}
                                      </div>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
