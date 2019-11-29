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
            let crawlResult, persistResult;
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
            console.log(`[${Date()}] - SUCCESS | Resources crawled are: \r\n`, crawlResult);
            persistResult = await db.persistResourcesBulk(crawlResult, {dataSource, resourceType});
            if(persistResult.success)
                console.log(`[${Date()}] - SUCCESS | ${persistResult.resourcesCount} resources persisted to db`);
        }
        catch(err){
            console.log(`[${Date()}] - ERROR occurred when crawling|persisting resources \r\n`, err);
        }
        finally{
            process.exit(0);
        }
    }
    else{
        console.log('INVALID INPUT - Please provide --dataSource and --resourceType parameter values');
    }

})();

