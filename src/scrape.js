const scrapeIt = require('scrape-it');
const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');

const writeFile = Promise.promisify(fs.writeFile);
const videoCategory = 'at-home-workouts';

const fetchVideoPageUrls = () => scrapeIt(`https://watch.lesmillsondemand.com/${videoCategory}`, {
  context: {
    listItem: 'select.js-switch-season > option',
    data: {
      url: {
        attr: 'value'
      },
    }
  }
}).then(({ data: { context } }) => context.map(({ url }) => url));

const fetchVideoIds = videoPageUrl => scrapeIt(videoPageUrl, {
  context: {
    listItem: 'ul.js-load-more-items-container > li',
    data: {
      properties: {
        selector: 'a.browse-item-link',
        attr: 'data-track-event-properties',
        convert: x => JSON.parse(x),
      }
    }
  }
}).then(({ data: { context } }) => context.map(({ properties: { id, label } }) => ({
  id,
  title: label,
})));

const saveVideoIdsToJson = videoIds => writeFile('./downloads/video_ids.json', JSON.stringify(videoIds, null, 4));

(async () => {
  const videoPageUrls = (await fetchVideoPageUrls());
  console.log(videoPageUrls);

  const allVideoIds = [];
  await Promise.all(videoPageUrls.map(url => fetchVideoIds(url)))
    .map(videoIds => videoIds.map(videoId => ({
      title: videoId.title,
      url: `https://embed.vhx.tv/videos/${videoId.id}?vimeo=1`,
    })))
    .map(videoIds => videoIds.map(videoId => allVideoIds.push(videoId)));
  const uniqVideoIds = _.uniqBy(allVideoIds, 'url');

  console.log(uniqVideoIds);
  console.log(`Total videos: ${uniqVideoIds.length}`);
  saveVideoIdsToJson(uniqVideoIds).then(() => console.log('Scraped data saved.'));
})();
