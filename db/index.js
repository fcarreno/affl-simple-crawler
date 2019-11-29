const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'sql9.freemysqlhosting.net',
    user: process.env.DB_USER || 'sql9313622', // TODO: move to .env
    password: process.env.DB_PASSWORD || '6RBmF3tYPr', // TODO: move to .env
    database:  process.env.DB_DATABASE || 'sql9313622'
});
const promisedPool = pool.promise();
const affluentConfig = require(__base + '/data_sources/websites/affluent/affluent-config');
const reqresConfig = require(__base + '/data_sources/apis/rest/reqres/reqres.in-config');


class Db {
    constructor(){
        this.pool = promisedPool;
    }

    _getResourceModelMappings(resourceMetadata = {}){

        switch(resourceMetadata.dataSource){
            case 'reqres':
                return reqresConfig.resources[resourceMetadata.resourceType].model_mappings;


            case 'affluent':
                return affluentConfig.resources[resourceMetadata.resourceType].model_mappings;

            default:
                throw Error(`No model mappings available for requested DATA SOURCE=${resourceMetadata.dataSource}`);
        }

    }

    // TODO: migrate to ORM (e.g.: sequelize...)
    async persistResourcesBulk(resources, resourceMetadata) {

        let sql, bulkValues, persistResult;
        try{
            let resourceModelMappings = this._getResourceModelMappings(resourceMetadata);
            if(resourceModelMappings){
                sql = `INSERT INTO ${resourceModelMappings.dbTable} VALUES ?`;
                bulkValues =  this._getBulkValues(resources, resourceMetadata);
                [persistResult] = await this.pool.query(sql, bulkValues);
                if(persistResult.affectedRows)
                    return {success: true, resourcesCount: persistResult.affectedRows};
                else
                    return {success: false};
            }
        }catch(err){
            throw err;
        }
    }

    // Simple mapping from model to db (fields names & order in model + db matches)
    // More flexibility possible from ORM
    _getBulkValues(resources, resourceMetadata = {}) {

        let bulkValues = [];
        for(let i=0;i<resources.length;i++){
                bulkValues.push(Object.values(resources[i]));
        }
        return [bulkValues];
    }

}
module.exports = new Db();







