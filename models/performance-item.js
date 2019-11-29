class PerformanceItem {

    constructor({date, commissions, sales, leads, clicks, epc, impressions, cr}){
        this.date = date;
        this.commissions = commissions;
        this.sales = sales;
        this.leads = leads;
        this.clicks = clicks;
        this.epc = epc;
        this.impressions = impressions;
        this.cr = cr;
    }

}
module.exports = PerformanceItem;