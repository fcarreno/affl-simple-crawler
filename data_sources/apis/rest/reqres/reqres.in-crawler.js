const API_CONFIG = require('./reqres.in-config');
const mapper = require('./reqres.in-mapper');
const reqPromise = require('request-promise');


// TODO: may extend from generic REST API crwler class to inherit common behavior and DRY.
class ReqResCrawler {
    constructor(){
        this.mapper = mapper;
        this.API_CONFIG = API_CONFIG;
    }

    // No exhaustive parameter validation is included (e.g.: crawlParams.pages as integer, etc)
    async crawl(resourceType, crawlParams){

        let crawlResult;
        try{
            switch(resourceType){
                case 'users':
                    crawlResult = await this._getUsers(crawlParams);
                    break;

                default:
                    throw Error(`No crawler available for requested RESOURCE TYPE=${resourceType}`);
            }
            return crawlResult;
        }
        catch(err){
            throw err;
        }
    }

    /** 
     * For simplicity, specifying start page is not supported when paginating responses (always start from 1).
    **/
    async _getUsers (crawlParams = {}){

        const resourceConfig = this.API_CONFIG.resources.users;
        let requestUrl = `${this.API_CONFIG.main_url}${resourceConfig.path}`;
        let users = [];
        let apiResponse;
        let {pages} = crawlParams;

        requestUrl += `?${resourceConfig.pagination_cfig.query_string_param}=1` // Start page param initially not supported...(always start from 1)
        try{
            for(let currPage=1;currPage<=pages;currPage++){
                apiResponse = JSON.parse(await reqPromise(requestUrl));
                if(apiResponse.data && apiResponse.data.length){ // NOTE: .data property/property path within response object could part be config too...
                    users = users.concat(apiResponse.data); // TODO: maybe .push is enough over the same instance instead of .concat?
                    requestUrl = requestUrl.replace(`${resourceConfig.pagination_cfig.query_string_param}=${currPage}`,
                                                    `${resourceConfig.pagination_cfig.query_string_param}=${currPage+1}`);
                }
                else{
                    break; // Prevent additional pagination if we failed to get data...
                }
            }
            return this.mapper.map(resourceConfig.type, users);
        }catch(err){
            console.log(`[${Date()}] ==> Failed to get resource/s from DATASOURCE crawler : ${API_CONFIG.name}`);
            console.log(`[${Date()}] ==> REQUEST URL: ${requestUrl}`);
            throw err;
        }
    }

}
module.exports = new ReqResCrawler();


