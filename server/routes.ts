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

  // Check for duplicate project name
  app.get(`${apiPrefix}/sheets/check-project`, async (req, res) => {
    try {
      const projectName = req.query.projectName as string;

      if (!projectName) {
        return res.status(400).json({ error: "Project name is required" });
      }

      const spreadsheetId = process.env.DEFAULT_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
      const range = process.env.DEFAULT_RANGE || DEFAULT_RANGE;

      // Get all data
      const data = await getSheetData(spreadsheetId, range);

      if (!data.values || data.values.length <= 1) {
        return res.json({ exists: false });
      }

      // Skip the header row, check if the project name exists
      const exists = data.values.slice(1).some(row => 
        row[1]?.toLowerCase() === projectName.toLowerCase()
      );

      res.json({ exists });
    } catch (error) {
      console.error("Error checking project name:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Error checking project name"
      });
    }
  });

  // Check for duplicate team name
  app.get(`${apiPrefix}/sheets/check-team`, async (req, res) => {
    try {
      const teamName = req.query.teamName as string;

      if (!teamName) {
        return res.status(400).json({ error: "Team name is required" });
      }

      const spreadsheetId = process.env.DEFAULT_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
      const range = process.env.DEFAULT_RANGE || DEFAULT_RANGE;

      // Get all data
      const data = await getSheetData(spreadsheetId, range);

      if (!data.values || data.values.length <= 1) {
        return res.json({ exists: false });
      }

      // Skip the header row, check if the team name exists
      const exists = data.values.slice(1).some(row => 
        row[0]?.toLowerCase() === teamName.toLowerCase()
      );

      res.json({ exists });
    } catch (error) {
      console.error("Error checking team name:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Error checking team name"
      });
    }
  });

  // Check for duplicate student ID
  app.get(`${apiPrefix}/sheets/check-student-id`, async (req, res) => {
    try {
      const studentId = req.query.studentId as string;

      if (!studentId) {
        return res.status(400).json({ error: "Student ID is required" });
      }

      const spreadsheetId = process.env.DEFAULT_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
      const range = process.env.DEFAULT_RANGE || DEFAULT_RANGE;

      // Get all data
      const data = await getSheetData(spreadsheetId, range);

      if (!data.values || data.values.length <= 1) {
        return res.json({ exists: false });
      }

      // Skip the header row, check if the student ID exists in any of the student ID columns
      const exists = data.values.slice(1).some(row => 
        (row[3] === studentId) || (row[4] === studentId) || (row[5] === studentId)
      );

      res.json({ exists });
    } catch (error) {
      console.error("Error checking student ID:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Error checking student ID"
      });
    }
  });

  // Registration endpoint - Submit form data to Google Sheets
  app.post(`${apiPrefix}/sheets/register`, async (req, res) => {
    try {
      const { teamName, projectName, projectDescription, studentId1, studentId2, studentId3 } = req.body;

      // Validate required fields
      if (!teamName) {
        return res.status(400).json({ error: "Team name is required" });
      }

      if (!projectName) {
        return res.status(400).json({ error: "Project name is required" });
      }

      if (!studentId1) {
        return res.status(400).json({ error: "At least one student ID is required" });
      }

      // Validate student ID format (13 digits)
      const validateStudentId = (id: string | undefined) => {
        if (id && !/^\d{13}$/.test(id)) {
          return false;
        }
        return true;
      };

      if (!validateStudentId(studentId1)) {
        return res.status(400).json({ error: "Student ID 1 must be a 13-digit number" });
      }

      if (studentId2 && !validateStudentId(studentId2)) {
        return res.status(400).json({ error: "Student ID 2 must be a 13-digit number" });
      }

      if (studentId3 && !validateStudentId(studentId3)) {
        return res.status(400).json({ error: "Student ID 3 must be a 13-digit number" });
      }

      // Get spreadsheet ID and range for data fetching
      const spreadsheetId = process.env.DEFAULT_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
      const fetchRange = process.env.DEFAULT_RANGE || DEFAULT_RANGE;

      // Check for duplicate team name
      const data = await getSheetData(spreadsheetId, fetchRange);

      if (data.values && data.values.length > 1) {
        // Check for duplicate team name
        const teamExists = data.values.slice(1).some(row => 
          row[0]?.toLowerCase() === teamName.toLowerCase()
        );

        if (teamExists) {
          return res.status(400).json({ error: "Team name already exists. Please choose a different name." });
        }

        // Check for duplicate project name
        const projectExists = data.values.slice(1).some(row =>
          row[1]?.toLowerCase() === projectName.toLowerCase()
        );

        if (projectExists) {
          return res.status(400).json({ error: "Project name already exists. Please choose a different name." });
        }

        // Check for duplicate student IDs
        const studentsToCheck = [studentId1];
        if (studentId2) studentsToCheck.push(studentId2);
        if (studentId3) studentsToCheck.push(studentId3);

        for (const id of studentsToCheck) {
          const studentExists = data.values.slice(1).some(row => 
            row[3] === id || row[4] === id || row[5] === id
          );

          if (studentExists) {
            return res.status(400).json({ error: `Student ID ${id} is already registered. Each student can only be part of one team.` });
          }
        }
      }

      // We'll append to the sheet with a specific range
      const appendRange = "Sheet1!A:F"; // Adjust the range to match your sheet's structure

      // Format data for Google Sheets
      // Each row is an array of values
      const values = [
        [
          teamName,
          projectName,
          projectDescription || "",
          studentId1,
          studentId2 || "",
          studentId3 || ""
        ]
      ];

      // Append data to the sheet
      const result = await appendDataToSheet(spreadsheetId, appendRange, values);

      res.json({
        success: true,
        updatedRange: result.updates?.updatedRange,
        updatedRows: result.updates?.updatedRows,
      });
    } catch (error) {
      console.error("Error registering project:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Error registering project" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}