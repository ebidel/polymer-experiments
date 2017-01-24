# Stock Ticker

Stock Ticker is an example of using Polymer to create a stock ticker component to render stock/trading information from google's financial public url.  
It will get data from URL, then parse it and render appropriately; all within component that can be used elsewhere.

The project has 2 types of stock tickers

1. Stock ticker - Separation between template and logic code `<stock-ticker></stock-ticker>`
2. Stock ticker (raw) - both template and logic code is combined into a single file `<stock-ticker-raw></stock-ticker-raw>`

# NPM Scripts

You can execute following NPM commands to do things with the project

1. `npm start` - build and start local http server. It will listen at port 3000, you can go to your browser at [http://localhost:3000](http://localhost:3000) to test things out.
2. `npm build` - build project; this will specifically run `vulcanize` to manage dependency on html import and `crisper` to extract JS code into separate file, then finally `babel` JS file. This command will be run automatically as part of `npm start`. It runs commands ass seen in `./build.sh`.
3. `npm test` - start `karma` + `jasmine` test suite for both types of Stock ticker. This is with intention to demonstrate how to test polymer-based project.
