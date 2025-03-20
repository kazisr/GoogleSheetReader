import { google } from 'googleapis';

// Initialize the Google Sheets API with API key
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
