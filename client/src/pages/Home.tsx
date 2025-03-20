import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConnectionStatus from "@/components/ConnectionStatus";
import DataTable from "@/components/DataTable";
import ConfigurationCard from "@/components/ConfigurationCard";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Configuration } from "@/types";

export default function Home() {
  const { toast } = useToast();
  const [location] = useLocation();
  const isConfigPage = location === "/configKazisr";
  
  const [config, setConfig] = useState<Configuration>({
    spreadsheetId: import.meta.env.VITE_DEFAULT_SPREADSHEET_ID || "1NIpzqKR8rGTIRsO_48BD91AOjF6U6m6ilrUkG0mnJz8",
    range: import.meta.env.VITE_DEFAULT_RANGE || "Sheet1!A1:Z100"
  });

  // Fetch connection status
  const connectionStatusQuery = useQuery({
    queryKey: ["/api/sheets/status"],
    refetchOnWindowFocus: true,
  });

  // Fetch sheet data
  const sheetDataQuery = useQuery({
    queryKey: ["/api/sheets/data", config.spreadsheetId, config.range],
    refetchOnWindowFocus: true,
  });

  const handleRefresh = async () => {
    await Promise.all([
      connectionStatusQuery.refetch(),
      sheetDataQuery.refetch()
    ]);
    toast({
      title: "Data refreshed",
      description: "The latest data has been fetched from Google Sheets."
    });
  };

  const handleSaveConfig = async (newConfig: Configuration) => {
    try {
      await apiRequest("POST", "/api/sheets/config", newConfig);
      setConfig(newConfig);
      toast({
        title: "Configuration saved",
        description: "Your Google Sheets configuration has been updated."
      });
      // Refetch data with new configuration
      sheetDataQuery.refetch();
    } catch (error) {
      toast({
        title: "Error saving configuration",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const connectionStatus = connectionStatusQuery.data || {
    connected: false,
    authenticated: false,
    spreadsheetId: config.spreadsheetId,
    range: config.range
  };

  const isLoading = connectionStatusQuery.isLoading || sheetDataQuery.isLoading;
  const isError = connectionStatusQuery.isError || sheetDataQuery.isError;
  const isAuthenticated = !isError && connectionStatus.authenticated;

  // Add a page title
  useEffect(() => {
    document.title = isConfigPage ? "Configuration - Project Registration Manager" : "Project Data - Project Registration Manager";
  }, [isConfigPage]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onRefresh={handleRefresh} />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {isConfigPage && (
            <ConnectionStatus 
              status={connectionStatus} 
              isLoading={connectionStatusQuery.isLoading}
              isError={connectionStatusQuery.isError} 
            />
          )}
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isConfigPage ? "Spreadsheet Configuration" : "Project Registration Data"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isConfigPage 
                ? "Configure connection settings for the Google Sheets integration." 
                : "View all registered projects and teams from the connected Google Sheet."}
            </p>
          </div>
          
          <DataTable 
            data={sheetDataQuery.data} 
            isLoading={sheetDataQuery.isLoading} 
            isError={sheetDataQuery.isError || !isAuthenticated}
            errorMessage={isAuthenticated ? "Unable to fetch spreadsheet data" : "Authentication error with Google Sheets API"}
            onRefresh={handleRefresh} 
          />
          
          {isConfigPage && (
            <ConfigurationCard 
              config={config} 
              onSave={handleSaveConfig} 
              onReload={handleRefresh} 
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
