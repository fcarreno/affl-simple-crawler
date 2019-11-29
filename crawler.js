global.__base = __dirname;
const cmdLineParsedParams = require('minimist')(process.argv.slice(2)); // Getting values starting from 3rd cmd line parameter and on (after `node crawler.js`)
const reqres = require('./data_sources/apis/rest/reqres/reqres.in-crawler');
const affluent = require('./data_sources/websites/affluent/affluent-crawler');
const db = require('./db');


// TODO: add support for parameter to specify 'all pages' need to be crawled for a given resource (besides a particular number)?
(async()=> {
    const {dataSource, resourceType, dateRangeFrom, dateRangeTo, pages = 1} = cmdLineParsedParams;
    if(dataSource && resourceType) {
        console.log(`[${Date()}] - Crawling process requested for DATASOURCE=${dataSource} | RESOURCE TYPE=${resourceType}`);
        try{
            let crawlResult;
            switch(dataSource){
                case 'reqres':
                    crawlResult = await reqres.crawl(resourceType, {pages});
                    break;

                case 'affluent':
                    crawlResult = await affluent.crawl(resourceType, {pages,
                                                                      dateRangeFrom: dateRangeFrom || '08/01/2019',
                                                                      dateRangeTo: dateRangeTo || '08/31/2019'});
                    break;

                default:
                    console.log(`[${Date()}] - No crawler available for DATA SOURCE. Please try with one of the supported ones.`);
                    return;
            }
            console.log(`[${Date()}] - SUCCESS | Crawler result is: \r\n`, crawlResult);
        }
        catch(err){
            console.log(`[${Date()}] - ERROR occurred during crawling process\r\n`, err);
        }
    }
    else{
        console.log('INVALID INPUT - Please provide --dataSource and --resourceType parameter values');
    }

    //try {
    //    let [users] = await db.query('SELECT * FROM USERS'); //
    //    console.log(users)
    // }
    // catch(err){
    //    console.log(err);
    // }


})();

