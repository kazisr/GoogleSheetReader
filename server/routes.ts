import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getSheetData, checkConnection, appendDataToSheet } from "./googleSheets";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route prefix
  const apiPrefix = "/api";

  // Default spreadsheet ID and range
  const DEFAULT_SPREADSHEET_ID = "1NIpzqKR8rGTIRsO_48BD91AOjF6U6m6ilrUkG0mnJz8";
  const DEFAULT_RANGE = "Sheet1!A1:Z100";

  // Get Google Sheets API connection status
  app.get(`${apiPrefix}/sheets/status`, async (req, res) => {
    try {
      // Check connection to Google Sheets API
      const connectionStatus = await checkConnection();

      // Get default config values
      const spreadsheetId = process.env.DEFAULT_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
      const range = process.env.DEFAULT_RANGE || DEFAULT_RANGE;

      res.json({
        ...connectionStatus,
        spreadsheetId,
        range,
      });
    } catch (error) {
      console.error("Error checking connection status:", error);
      res.status(500).json({ 
        connected: false, 
        authenticated: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get Google Sheets data
  app.get(`${apiPrefix}/sheets/data`, async (req, res) => {
    try {
      const spreadsheetId = req.query.spreadsheetId as string || process.env.DEFAULT_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
      const range = req.query.range as string || process.env.DEFAULT_RANGE || DEFAULT_RANGE;

      if (!spreadsheetId) {
        return res.status(400).json({ error: "Spreadsheet ID is required" });
      }

      const data = await getSheetData(spreadsheetId, range);
      res.json(data);
    } catch (error) {
      console.error("Error fetching sheet data:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Error fetching spreadsheet data" 
      });
    }
  });

  // Update configuration
  app.post(`${apiPrefix}/sheets/config`, async (req, res) => {
    try {
      const { spreadsheetId, range } = req.body;
      
      if (!spreadsheetId) {
        return res.status(400).json({ error: "Spreadsheet ID is required" });
      }
      
      if (!range) {
        return res.status(400).json({ error: "Range is required" });
      }
      
      // Save configuration
      // Note: In a real application, this would be saved to the database
      // Currently we're just returning the provided configuration
      res.json({ 
        spreadsheetId, 
        range,
        success: true
      });
    } catch (error) {
      console.error("Error updating configuration:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Error updating configuration" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
