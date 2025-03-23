import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConnectionStatus as ConnectionStatusType } from "@/types";

interface ConnectionStatusProps {
  status: ConnectionStatusType;
  isLoading: boolean;
  isError: boolean;
}

export default function ConnectionStatus({ status, isLoading, isError }: ConnectionStatusProps) {
  const getStatusIndicator = () => {
    if (isLoading) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
          <Skeleton className="h-4 w-20" />
        </div>
      );
    }
    
    if (isError || !status.connected) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-destructive bg-opacity-10 text-destructive">
          <XCircle className="h-4 w-4 mr-1" />
          Disconnected
        </div>
      );
    }
    
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-4 w-4 mr-1" />
        Connected
      </div>
    );
  };

  return (
    <Card className="mb-6">
      <CardContent className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Connection Status</h2>
            <p className="mt-1 text-sm text-gray-500">Google Sheets API connection information</p>
          </div>
          {getStatusIndicator()}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700">Authentication</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-40 mt-2" />
            ) : (
              <p className="mt-2 text-sm text-gray-900">
                {isError || !status.authenticated ? '❌ Not authenticated with Google API' : '✓ Authenticated with Google API'}
              </p>
            )}
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700">Spreadsheet ID</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-40 mt-2" />
            ) : (
              <p className="mt-2 text-sm font-mono text-gray-900">
                {status.spreadsheetId || "Not set"}
              </p>
            )}
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700">Selected Range</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-40 mt-2" />
            ) : (
              <p className="mt-2 text-sm font-mono text-gray-900">
                {status.range || "Not set"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
