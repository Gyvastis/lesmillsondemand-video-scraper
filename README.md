# lesmillsondemand-video-scraper

Downloads videos from [https://watch.lesmillsondemand.com/at-home-workouts/](https://watch.lesmillsondemand.com/).

## Usage

* run `yarn` to install dependencies
* run `yarn scrape` to scrape video URLs and titles
* run `yarn download` to download the videos

Data is stored at `./downloads`.

Currently set to scrape `at-home-workouts` category. Can be changed at `./src/scrape.js` `videoCategory`

You can change the number of concurrent downloads in `./src/download.js` `concurrentDownloads`.

Enjoy 🍉
