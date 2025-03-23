import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

// Initialize the Google Sheets API with API key for reading data
export async function initializeGoogleSheetsClient() {
  try {
    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is not set');
    }
    
    // Create Google Sheets API client with API key
    const sheets = google.sheets({ 
      version: 'v4', 
      auth: apiKey
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

// Initialize the Google Sheets API with service account for writing data
export async function initializeServiceAccountClient() {
  try {
    // Load credentials file from attached_assets
    const credentialsPath = path.join(process.cwd(), 'attached_assets/credentials.json');
    
    if (!fs.existsSync(credentialsPath)) {
      throw new Error('Service account credentials file not found');
    }
    
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
    // Set up service account credentials
    const client = new google.auth.JWT(
      credentials.client_email,
      undefined,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    // Authorize the client
    await client.authorize();
    
    // Create Google Sheets API client with service account
    const sheets = google.sheets({ 
      version: 'v4', 
      auth: client
    });
    
    return {
      client: sheets,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Error initializing service account client:', error);
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

export async function appendDataToSheet(
  spreadsheetId: string, 
  range: string, 
  values: string[][]
) {
  try {
    // Use service account client for write operations
    const { client, isAuthenticated } = await initializeServiceAccountClient();
    
    if (!client || !isAuthenticated) {
      throw new Error('Not authenticated with Google Sheets API');
    }
    
    const response = await client.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error appending data to sheet:', error);
    throw error;
  }
}
