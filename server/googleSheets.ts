import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

// Initialize the Google Sheets API with service account
export async function initializeGoogleSheetsClient() {
  try {
    // Read credentials file
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    
    if (!fs.existsSync(credentialsPath)) {
      throw new Error('Service account credentials file not found');
    }
    
    // Create a new JWT client using the service account for auth
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    // Get client
    const authClient = await auth.getClient();
    
    // Create Google Sheets API client
    const sheets = google.sheets({ 
      version: 'v4', 
      auth: authClient 
    });
    
    return {
      client: sheets,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    return {
      client: null,
      isAuthenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getSheetData(spreadsheetId: string, range: string) {
  try {
    const { client, isAuthenticated } = await initializeGoogleSheetsClient();
    
    if (!client || !isAuthenticated) {
      throw new Error('Not authenticated with Google Sheets API');
    }
    
    const response = await client.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

export async function checkConnection() {
  const { client, isAuthenticated, error } = await initializeGoogleSheetsClient();
  
  return {
    connected: !!client,
    authenticated: isAuthenticated,
    error,
  };
}
