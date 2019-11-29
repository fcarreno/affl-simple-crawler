const WEB_CONFIG = require('./affluent-config');
const mapper = require('./affluent-mapper');
const puppeteer = require('puppeteer');


// TODO: may extend from generic WEB crwler class to inherit common behavior and DRY.
class AffluentCrawler {
    constructor(browser){
        this.mapper = mapper;
        this.WEB_CONFIG = WEB_CONFIG;
        this.browser = browser; // accepting an instance of browser (puppeteer) already launched (e.g.: if available from other crawler processes...)
    }

    // NOTE: No exhaustive parameter validation is included (e.g.: crawlParams.pages as integer, dataRangeFrom & To expected format ,etc)
    async crawl(resourceType, crawlParams){

        let crawlResult;
        try{
            switch(resourceType){
                case 'performance': // Only supporting a single performance (byDateRange) report for now.
                    if(this.WEB_CONFIG.requires_login){
                        await this.login();
                    }
                    crawlResult = await this._getPerformanceByDateRange(crawlParams);
                    break;

                default:
                    throw Error(`No crawler available for requested RESOURCE TYPE=${resourceType}`);
            }
            return crawlResult;
        }
        catch(err){
            throw err;
        }
        finally{
            this._closeBrowser(); // cleanup
        }

    }

    async login(){
        const loginParams = this.WEB_CONFIG.login_params;
        let loginUrl = `${this.WEB_CONFIG.main_url}${loginParams.path}`;

        let browser = await this._getBrowser();
        const page = await browser.newPage();
        await page.goto(loginUrl);
        await page.type(loginParams.fields.user.selector, loginParams.fields.user.value);
        await page.type(loginParams.fields.password.selector, loginParams.fields.password.value);
        await page.click(loginParams.submit.selector);
        await page.waitForSelector(loginParams.success.selector);
    }

    async _getBrowser(){
        if(!this.browser){
          this.browser = await puppeteer.launch({slowMo: 100});
        }
        return this.browser;
    }

    async _closeBrowser(){
        this.browser && this.browser.close();
    }
    /**
     * For simplicity, specifying start page is not supported when paginating responses (always start from 1).
     * In addition, a new browser page is opened for each navigation request.
     * (possible optimization would be to reuse page used for login, if possible)
     * TODO: can potentially split this into A- Navigation to request page B- Fill request page parameters + submit+ response....
     * TODO: pagination logic could be extracted to a diff method....
    **/
    async _getPerformanceByDateRange (crawlParams = {}){

        const resourceConfig = this.WEB_CONFIG.resources.performance;
        let requestPageUrl = `${this.WEB_CONFIG.main_url}${resourceConfig.path}`;
        let requestPageParams = resourceConfig.request_page_params;
        let responsePageParams = resourceConfig.response_page_params;
        let {dateRangeFrom, dateRangeTo, pages} = crawlParams;
        let performanceItems = [];
        let browser;

        try{
            browser = await this._getBrowser();
            const page = await browser.newPage();

            // Navigation to request page.
            await page.goto(requestPageUrl);
            await page.waitForSelector(requestPageParams.success.selector);

            // Filling request page parameters and submit.
            await page.click(requestPageParams.fields.date_range.open_date_range.selector); // NOTE: in some instances this fails - and works with puppeteer headless: false
                                                                                            // Setting slowMo seems to help for now..
            await page.click(requestPageParams.fields.date_range.date_range_params.date_range_from.selector, {clickCount: 3}); // Simulate triple click to select all
            await page.type(requestPageParams.fields.date_range.date_range_params.date_range_from.selector, dateRangeFrom); // And then replace date
            await page.click(requestPageParams.fields.date_range.date_range_params.date_range_to.selector, {clickCount: 3}); // Simulate triple click to select all
            await page.type(requestPageParams.fields.date_range.date_range_params.date_range_to.selector, dateRangeTo); // And then replace date
            await page.click(requestPageParams.submit.selector);

            // Checking initial response success and parse
            await page.waitForSelector(responsePageParams.success.selector);
            performanceItems = await this._parsePerformanceByDateRange(page, responsePageParams.list_params.table_params.row_params.selector,
                                                                             responsePageParams.list_params.table_params.column_params);

            let remainingPages; // Paginate if we need to...
            for(let currPage=1;currPage<pages;currPage++){
                remainingPages = await page.$(resourceConfig.pagination_cfig.web_pagination_params.selectors.next_page);
                if(remainingPages){
                    await page.click(resourceConfig.pagination_cfig.web_pagination_params.selectors.next_page);
                    await page.waitForSelector(responsePageParams.success.selector);
                    performanceItems = performanceItems.concat(await this._parsePerformanceByDateRange(page, responsePageParams.list_params.table_params.row_params.selector,
                                                                                                             responsePageParams.list_params.table_params.column_params));
                }
                else{
                    break; // Prevent additional pagination if no more pages are available...
                }
            }
            return this.mapper.map(resourceConfig.type, performanceItems);

        }catch(err){
            console.log(`[${Date()}] ==> Failed to get resource/s from DATASOURCE crawler : ${WEB_CONFIG.name}`);
            console.log(`[${Date()}] ==> REQUEST URL: ${requestPageUrl}`);
            throw err;
        }
    }

    // TODO: parsers could be a separate entity (outside crawler - e.g.: in charge of just parsing html/web content and returning parsed data/assets to crawler)
    // Could also use cheerio with pupeteer's page html as source (instead of using eval - which seems 'hacky')...
    // Assumption: columns are always in the same -expected- order (thus the simplicity in the mapping/parsing logic below)
    _parsePerformanceByDateRange(page, responseAssetSelector, responseAssetConfig) {

        return page.$$eval(responseAssetSelector, (tableRows, responseAssetConfig) => {
                            return tableRows.map((tr,index) => {               // For each row of the table containing the response asset info:
                                   const tds = tr.getElementsByTagName('td');  // 1- Get the data items (cell/columns) included
                                                                               // 2- Create a key/value object/hash with the data
                                                                               // (key is the field name in the API/Web context/domain, from config)
                                   let responseAssetObj = {};
                                   for(let i = 0;i<tds.length;i++){
                                        responseAssetObj[responseAssetConfig[i].name]=tds[i].textContent;
                                   }
                                   return responseAssetObj;
                            })
                    }, responseAssetConfig);
    }
}

module.exports = new AffluentCrawler();


