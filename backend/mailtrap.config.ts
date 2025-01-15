const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); // Ensure the correct path to .env

// Import the MailtrapClient
const { MailtrapClient } = require('mailtrap');

// Debug environment variables
console.log('Loaded Environment Variables:', process.env);

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// Log environment variables to confirm they are loaded correctly
console.log('MAILTRAP_TOKEN:', TOKEN);
console.log('MAILTRAP_ENDPOINT:', ENDPOINT);

// Exit if environment variables are missing
if (!TOKEN || !ENDPOINT) {
    console.error('Missing Mailtrap configuration. Check your .env file.');
    process.exit(1);
}

// Initialize Mailtrap client
const client = new MailtrapClient({
    endpoint: ENDPOINT,
    token: TOKEN,
});

// Define sender and recipients
export const sender = {
    email: 'hello@demomailtrap.com',
    name: 'ABDULBASIT',
};
export const recipients = [
    {
        email: 'abdulbasitabdulwahab21@gmail.com',
    },
];

// Export Mailtrap client for use in other modules
export { client as MailtrapClient };
