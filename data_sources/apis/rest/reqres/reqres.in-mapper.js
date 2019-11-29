const API_CONFIG = require('./reqres.in-config');
const User = require(__base + '/models/user');


// TODO: may extend from generic resources Mapper class to inherit common behavior and DRY.
// Maps resources/data from API model to app domain model instances.
// Just simple mapping between models is performed (no complex logic - while usually required to normalize data.
// --> E.g.: data/data type transformations, string manipulations, etc
class ReqResMapper {
    constructor(){
        this.API_CONFIG = API_CONFIG;
    }

    map(resourceType, resources){
        switch(resourceType){
            case 'users':
                return this._mapUsers(resources);

            default:
                throw Error('No mapper available for requested RESOURCE TYPE');
        }
    }


    _mapUsers(resources){

        const resourceConfigModelMappings = this.API_CONFIG.resources.users.model_mappings.fields;
        let users = [];

        // Map from API resource to app domain model.
        for(let i=0;i<resources.length;i++){
            let apiUser = resources[i];
            let modelUserTmpObj = {};
            for (let resourceConfigModelMappingKey in resourceConfigModelMappings){
                modelUserTmpObj[resourceConfigModelMappingKey] = apiUser[resourceConfigModelMappings[resourceConfigModelMappingKey]];
            }
            users.push(new User(modelUserTmpObj)); // To improve: target app model instace/type could be dynamically determined (from model_mappings.target)
        }
        return users;

    }

}

module.exports = new ReqResMapper();
