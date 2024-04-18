const { RefreshingAuthProvider } = require('@twurple/auth');
const { ChatClient } = require('@twurple/chat');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const express = require('express');
const path = require('path');

const readConfig = require('./readConfig.js');
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

async function startServer(hAddress, hPort) {
    return new Promise((resolve, reject) => {
        // Set up Express server to listen on the specified host address and port
        const server = app.listen(hPort, hAddress, () => {
            console.log(`Web server running on ${hAddress}:${hPort}`);
            resolve(server);
        });

        // Serve the index.html file with embedded data
        app.get('/', (req, res) => {
            const data = {
                socketAddress: hAddress,
                socketPort: hPort
            };
            res.render('index', data);
        });
        
    });
}



async function connectToTwitch(config, channels) {
    const authProvider = new RefreshingAuthProvider({
        clientId: config.client_id,
        clientSecret: config.client_secret
    });

    await authProvider.addUserForToken({
        accessToken: config.access_token,
        refreshToken: config.refresh_token
    }, ['chat']);

    const client = new ChatClient({ authProvider, channels });
    await client.connect();
    return { client, authProvider };
}


async function main() {
    try {
        // Initialize config and other necessary setup here...
        console.log('Entering main...')

        // Read config file
        const config = await readConfig.readConfigFile('./botconfig.json');

        // Connect to Twitch chat
        console.log('Connecting to Twitch...');
        const { client, authProvider } = await connectToTwitch(config, config.channels);

        // Initialize Socket.IO server
        console.log('Initializing socket server...');
        const io = await initializeSocket(config);

        // Handle incoming messages
        handleMessages(client, io);

        // Start web server
        console.log('Starting web server...');
        await startServer(config.serverAddress, config.serverPort);

        console.log('M O R T I S  engaged');

    } catch (error) {
        console.error('An error occurred in main():', error);
    }
}

async function servePage(hAddress, hPort){
    const data = {
        serverAddress: hAddress,
        serverPort: hPort
    };

}


async function initializeSocket(config) {
    const server = http.createServer();
    const io = new Server(server, {
        cors: {
            origin:`${config.serverAddress}:${config.serverPort}`
        }
    });

    server.listen(config['socket-port'], config.serverAddress, () => {
        console.log(`mortts-server listening on ${config.serverAddress}:${config.serverPort}\n\n`);
    });

    return io;
}


async function handleMessages(client, io) {
    client.onMessage(async (channel, username, message, msgObject) => {
        console.log(`(${channel}) [${username}]: ${message}`);

        io.on('hello', (socket) => {
            console.log('Client connected!');
        });

        if (/^!mort(ts|is|y)/i.test(message)) {
            const pitch = Math.floor(Math.random() * (150 - 10 + 1)) + 10;
            const speed = Math.floor(Math.random() * (150 - 10 + 1)) + 10;
            const singMode = Math.floor(Math.random() * 2) === 0 ? true : false;

            // Process incoming message and emit it
            const packet = JSON.stringify({ username, message, speed, pitch, singMode });
            console.log(packet);
            io.emit('mortts', packet);
        }
    });
}

class TwitchError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TwitchError';
    }
}

console.log('\n\n\n');
console.log("--- M O R T T S ---");
main();
console.log("Exiting...")