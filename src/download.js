const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');
const youtubedl = require('youtube-dl');

const readFile = Promise.promisify(fs.readFile);

const readVideoIdsFromJson = () => readFile('./downloads/video_ids.json')
  .then(text => JSON.parse(text));

const fileExists = fileName => {
  try {
    fs.accessSync(fileName, fs.constants.F_OK);
    return true
  }
  catch(e) {
    return false;
  }
};

const downloadVideo = (title, url) => new Promise((resolve, reject) => {
  const fileName = `./downloads/${_.snakeCase(title)}.mp4`;

  if(fileExists(fileName)) {
    console.log(`File '${fileName} is already downloaded.'`);
    resolve();
    return;
  }

  const video = youtubedl(url, [], { cwd: __dirname });

  video.on('info', function(info) {
    console.log(`Downloading '${title}' (${fileName})...`)
  });
  video.on('end', function() {
    console.log(`Downloaded '${title}' (${fileName})!`)
    resolve();
  });
  video.on('error', reject);

  video.pipe(fs.createWriteStream(fileName))
});

(async () => {
  const videoIds = await readVideoIdsFromJson();

  const { title, url } = videoIds[0];

  await Promise.map(videoIds, ({ title, url }) => downloadVideo(title, url), {
    concurrency: 5,
  });
})();
