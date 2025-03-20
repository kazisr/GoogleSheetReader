import { useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Configuration } from "@/types";

interface ConfigurationCardProps {
  config: Configuration;
  onSave: (config: Configuration) => void;
  onReload: () => void;
}

export default function ConfigurationCard({ config, onSave, onReload }: ConfigurationCardProps) {
  const [spreadsheetId, setSpreadsheetId] = useState(config.spreadsheetId);
  const [range, setRange] = useState(config.range);

  const handleSave = () => {
    onSave({
      spreadsheetId,
      range
    });
  };

  return (
    <Card className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Configuration</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Google Sheets API settings</p>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:px-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="spreadsheet-id" className="block text-sm font-medium text-gray-700">
              Spreadsheet ID
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="spreadsheet-id"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">The ID of your Google Sheet from the URL</p>
          </div>
          <div>
            <Label htmlFor="range" className="block text-sm font-medium text-gray-700">
              Range
            </Label>
            <div className="mt-1">
              <Input
                type="text"
                id="range"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">The range to pull data from (e.g. Sheet1!A1:C10)</p>
          </div>
          <div>
            <Button
              onClick={handleSave}
              className="inline-flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
            <Button
              variant="outline"
              onClick={onReload}
              className="ml-3 inline-flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
