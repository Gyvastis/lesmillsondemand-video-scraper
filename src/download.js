const _ = require('lodash');
const Promise = require('bluebird');
const fs = require('fs');
const youtubedl = require('youtube-dl');

const concurrentDownloads = 5;
const readFile = Promise.promisify(fs.readFile);

const readVideoIdsFromJson = () => readFile('./downloads/video_ids.json')
  .then(text => JSON.parse(text));

const downloadVideo = (title, url) => new Promise((resolve, reject) => {
  const fileName = `./downloads/${_.snakeCase(title)}.mp4`;

  const downloaded = fs.existsSync(fileName) ? fs.statSync(fileName).size : 0;
  const video = youtubedl(url, [], {
    start: downloaded,
    cwd: __dirname
  });

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
    concurrency: concurrentDownloads,
  });
})();
