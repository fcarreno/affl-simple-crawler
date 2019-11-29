# affl-simple-crawler

### Simple -command line- crawler utility to get data from different Data Sources and persist on a database (MySql)

### Accepts several command line parameters to drive actions/behavior

* `dataSource`: String (`reqres`|`affluent`) - The destination from which data will be retrieved.
Data Sources are pre-configured as part of the utility, so a different value than the supported ones will result in no-op.


* `resourceType`: String - Unique name within the Data Source built-in configuration, representing a specific resource/resource list to be crawled.
 Currently supported values are:
    * `users` (applicable to `reqres` Data Source)
    * `performance` (applicable to `affluent` Data Source)

    Several Resource Type specific parameters are also set up within the utility (things like pagination parameters and crawling instructions, such as element selectors, resource mappings from Data Source/API model to application model, etc).

    These parameters are meant to simplify potential changes required in the crawling process/logic, whenever Data Sources change the interface/s (e.g: REST API / Web, etc) from which the different Resources are obtained.

    For more details on config parameters/values, see [affluent-config.js](data_sources/websites/affluent/affluent-config.js) and [reqres.in-config.js](data_sources/apis/rest/reqres/reqres.in-config.js) files.


* `pages`: Number (int) - Amount of pages that crawling process will attempt to get resources from.
For the supported Data Sources, if # of pages specified is greater than the actual # of pages available, the process will stop and not attempt to retrieve more content/data.
Default value is `1`.

* `dateRangeFrom`: Date (MM/DD/YYYY) - Available only for `affluent` + `performance` (dataSource+resourceType) combo, to narrow down the range of resources to obtain from the affluent performance (by dates) report.


* `dateRangeTo`: Date (MM/DD/YYYY) - Same as `dateRangeFrom` - but to define the end date of the range.

For testing purposes, the crawler uses a specific range as default ==> `08/01/2019` to `08/31/2019` - which can be overriden with the command line parameters.

### After running the crawling process, the utility will reply with:

* The status of the crawling process (SUCCESS | ERROR + error details|info)
* The list of Resources crawled (mapped to app model version)
* The status of the persistence process (amount of resources persisted)


### SETUP & RUN

1. Clone the repo
2. `npm install` (install dependencies**)
3. `node crawler.js --dataSource=[reqres|affluent] --resourceType=[users|performance]`.

   Example: node crawler.js --dataSource=affluent --resourceType=performance --pages=2


** NOTE: keep in mind puppeteer (the tool used to crawl websites) download is 100+ Mb so installing the dependencies will take both - a bit of time and space.
