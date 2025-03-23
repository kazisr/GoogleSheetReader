import { useState } from "react";
import { 
  Table2, 
  RefreshCw, 
  AlertTriangle,
  Search
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { SheetData } from "@/types";

interface DataTableProps {
  data?: SheetData;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRefresh: () => void;
}

export default function DataTable({ 
  data, 
  isLoading, 
  isError, 
  errorMessage = "Unable to load data", 
  onRefresh 
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter data based on search term
  const filteredData = data?.values ? data.values.filter(row => 
    row.some(cell => 
      cell.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];
  
  // Get header row and data rows
  const headerRow = filteredData.length > 0 ? filteredData[0] : [];
  const dataRows = filteredData.length > 0 ? filteredData.slice(1) : [];
  
  const isEmpty = !isLoading && !isError && (!data?.values || data.values.length <= 1);
  
  // Skeleton loader for table
  const TableSkeleton = () => (
    <>
      <TableRow>
        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
      </TableRow>
      <TableRow>
        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-full" /></TableCell>
      </TableRow>
    </>
  );
  
  // Empty state component
  const EmptyState = () => (
    <div className="py-8">
      <div className="text-center">
        <Table2 className="h-12 w-12 text-gray-400 mx-auto" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
        <p className="mt-1 text-sm text-gray-500">No data is available in the specified range.</p>
        <div className="mt-6">
          <Button 
            onClick={onRefresh}
            className="inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
  
  // Error state component
  const ErrorState = () => (
    <div className="py-8">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Connection Error</h3>
        <p className="mt-1 text-sm text-gray-500">{errorMessage}</p>
        <div className="mt-6">
          <Button 
            onClick={onRefresh}
            className="inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <Card className="bg-white shadow-sm rounded-lg mb-6">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Spreadsheet Data</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Displaying data from your Google Sheet</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search data..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading || isError || isEmpty}
              />
            </div>
            <Button
              onClick={onRefresh}
              className="inline-flex items-center"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Desktop View: Table */}
        <div className="hidden md:block">
          {isError ? (
            <ErrorState />
          ) : isEmpty ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isLoading ? (
                      <>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-4 w-full" /></TableHead>
                      </>
                    ) : (
                      headerRow.map((header, index) => (
                        <TableHead key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </TableHead>
                      ))
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton />
                  ) : (
                    dataRows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Mobile View: Cards */}
        <div className="block md:hidden">
          {isError ? (
            <ErrorState />
          ) : isEmpty ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-gray-200">
              {isLoading ? (
                <>
                  <div className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </div>
                </>
              ) : (
                dataRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {headerRow.map((header, headerIndex) => (
                        <div key={headerIndex} className="text-xs font-medium text-gray-500">
                          {header}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {row.map((cell, cellIndex) => (
                        <div key={cellIndex} className="text-sm text-gray-900">
                          {cell}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full">
          <div className="text-sm text-gray-700">
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : isError || isEmpty ? (
              "No results to display"
            ) : (
              <>
                Showing <span className="font-medium">1</span> to <span className="font-medium">{dataRows.length}</span> of <span className="font-medium">{dataRows.length}</span> results
              </>
            )}
          </div>
          <div className="flex-1 flex justify-between sm:justify-end mt-2 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              disabled={true}
              className="relative inline-flex items-center px-4 py-2 text-sm"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={true}
              className="ml-3 relative inline-flex items-center px-4 py-2 text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
