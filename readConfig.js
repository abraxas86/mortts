const fs = require('fs');

// Used to read config file and load values
async function readConfigFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(new Error(`Error reading config file: ${err.message}`));
                return;
            }
            try {
                const config = JSON.parse(data);
                console.log('Config file read successfully.');
                resolve(config);
            } catch (error) {
                reject(new Error(`Error parsing config file: ${error.message}`));
            }
        });
    });
}

module.exports = {
    readConfigFile
};