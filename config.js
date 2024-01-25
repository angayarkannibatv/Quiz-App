const fs = require('fs');

function readConfig() {
    try {
      const configData = fs.readFileSync('config.json', 'utf8');
      return JSON.parse(configData);
    } catch (err) {
      console.error('Error reading the configuration file:', err.message);
      return null;
    }
}

module.exports = readConfig;
  