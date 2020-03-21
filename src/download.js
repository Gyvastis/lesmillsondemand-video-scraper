const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');

const readFile = Promise.promisify(fs.readFile);

const readVideoIdsFromJson = () => readFile('./downloads/video_ids.json')
  .then(text => JSON.parse(text));

(async () => {
  const videoIds = await readVideoIdsFromJson();
  
})();
