// Require the necessary packages
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

// Fetch the Google OAuth2 credentials from environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postMessage' // Use 'postMessage' for client-side OAuth2 or provide a redirect URI if needed
);

// Export the OAuth2 client for use in your application
export default { oauth2Client };
