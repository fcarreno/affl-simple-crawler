const WEB_CONFIG = require('./affluent-config');
const PerformanceItem = require(__base + '/models/performance-item');


// TODO: may extend from generic resources Mapper class to inherit common behavior and DRY.
// Maps resources/data from API model to app domain model instances.
// Just simple mapping between models is performed (no complex logic - while usually required to normalize data.
// --> E.g.: data/data type transformations, string manipulations, etc
class AffluentMapper {
    constructor(){
        this.WEB_CONFIG = WEB_CONFIG;
    }

    map(resourceType, resources){
        switch(resourceType){
            case 'performance':
                return this._mapPerformanceItems(resources);

            default:
                throw Error('No mapper available for requested RESOURCE TYPE');
        }
    }

    _mapPerformanceItems(resources){

        const resourceConfigModelMappings = this.WEB_CONFIG.resources.performance.model_mappings.fields;
        let performanceItems = [];

        // Map from API resource to app domain model.
        for(let i=0;i<resources.length;i++){
            let webPerformanceItem = resources[i];
            let modelPerformanceItemTmpObj = {};
            for (let resourceConfigModelMappingKey in resourceConfigModelMappings){
                modelPerformanceItemTmpObj[resourceConfigModelMappingKey] = webPerformanceItem[resourceConfigModelMappings[resourceConfigModelMappingKey]];
            }
            performanceItems.push(new PerformanceItem(modelPerformanceItemTmpObj)); // To improve: target app model instace/type could be dynamically determined (from model_mappings.target)
        }
        return performanceItems;

    }

}

module.exports = new AffluentMapper();
