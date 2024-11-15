const { RefreshingAuthProvider } = require('@twurple/auth');
const { ChatClient } = require('@twurple/chat');
const { Server } = require('socket.io');
const express = require('express');
const path = require('path');

const readConfig = require('./readConfig.js');
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// send sam-js library over to browser 
app.use('/sam-js', express.static(path.join(__dirname, 'node_modules', 'sam-js', 'dist')));

async function startServer(hAddress, hPort) {
    return new Promise((resolve, reject) => {
        const server = app.listen(hPort, hAddress, () => {
            console.log(`Web server running on ${hAddress}:${hPort}`);
            resolve(server);
        });

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
        console.log('Entering main...');

        // Use absolute path for the config file
        const configPath = path.join(__dirname, 'botconfig.json');
        const config = await readConfig.readConfigFile(configPath);

        console.log('Connecting to Twitch...');
        const { client, authProvider } = await connectToTwitch(config, config.channels);

        console.log('Initializing Express server...');
        const server = await startServer(config.serverAddress, config.serverPort);

        console.log('Initializing socket server...');
        const io = await initializeSocket(server, config);

        handleMessages(client, io);

        console.log('--- M O R T I S ---');
    } catch (error) {
        console.error('An error occurred in main():', error);
    }
}

async function servePage(hAddress, hPort) {
    const data = {
        serverAddress: hAddress,
        serverPort: hPort
    };

    // Placeholder function
}

async function initializeSocket(server, config) {
    const io = new Server(server, {
        cors: {
            origin: `${config.serverAddress}:${config.serverPort}`
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connection established. THIS IS NOT APPROVED BY THE VATICAN!');

        const greeting = "T̴̼̀̀h̶̜͛ë̴͔̗́͝ ̵̩́s̴̺͑̌ȩ̸̊r̵͔̤͂v̷̜̳̿ȅ̶͎r̶̛̮̫ ̴͉̳͗̈́ś̸͇͇́ě̶̻͕͝n̵̬̅̚s̸̩͝e̸͙̋s̴̘̱̽ ̴̢̱̇y̷͎̍o̵̺̺͊u̵̼̪̅̀r̷̯͒͝ ̷̢̻͝p̴̱̈́r̴̰̂e̸̺͌͝ṡ̴̹̋ẻ̶̗̱̑n̶͈̅c̶͉̔ė̶̝";
        socket.emit('hello', greeting);

        socket.on('disconnect', () => {
            console.log('Client disconnect. THE VATICAN APPROVES');
        });
    });

    console.log(`Socket.IO server initialized`);
    return io;
}

async function handleMessages(client, io) {
    client.onMessage(async (channel, username, message, msgObject) => {
        console.log(`(${channel}) [${username}]: ${message}`);

        if (/^!mor(bis|tts|ts|tis|ty)/i.test(message)) {
            const pitch = 90;
            const speed = 90;
            const singMode = false;

            const msg = message.split(' ').slice(1).join(' ');

            const packet = JSON.stringify({ username, msg, speed, pitch, singMode });
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
console.log("--- S T A R T I N G ---");
main();

console.log("Exiting...");
