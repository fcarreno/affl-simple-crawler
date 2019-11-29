const WEB_CONFIG = {
    name: 'AFFLUENT',
    type: 'WEB',
    main_url: 'https://publisher-dev.affluent.io',
    requires_login: true,
    login_params: {
        path: '/login',
        fields: {
            user: {
                selector: 'form input.form-control[name="username"]',
                value: process.env.CREDENTIALS_AFFLUENT_USER || 'developertest@affluent.io'
            },
            password: {
                selector: 'form input.form-control[name="password"]',
                value: process.env.CREDENTIALS_AFFLUENT_PASSWORD || 'SOpcR^37'
            }
        },
        submit: {
            selector: 'form button[type="submit"]'
        },
        success: {
            selector: '#current-user'
        },
        captcha_required: false
    },
    resources: {
        performance: {
            type: 'performance',
            path: '/list?type=dates',
            paginable: true,
            pagination_cfig: {
                type: 'WEB',
                web_pagination_params: {
                    selectors: {
                        main: 'ul.pagination[style="visibility: visible;"]',
                        next_page: 'ul.pagination[style="visibility: visible;"] li.next:not(.disabled) a'
                    }
                }
            },
            request_page_params: {
                fields: {
                    date_range: {
                        type: 'DATERANGE',
                        open_date_range: {
                            selector: '#dashboard-report-range'
                        },
                        date_range_params: {
                            date_range_from: {
                                selector: 'input[name="daterangepicker_start"]'
                            },
                            date_range_to: {
                                selector: 'input[name="daterangepicker_end"]'
                            }
                        }
                    }
                },
                submit: {
                    selector: 'div.range_inputs button.applyBtn'
                },
                success: {
                    selector: '#dashboard-report-range'
                },
                captcha_required: false
            },
            response_page_params: {
                type: 'list',
                list_params: {
                    htmlType: 'table',
                    table_params: {
                        selector: 'table[data-url="dates"]',
                        row_params: {
                            selector: 'table[data-url="dates"] > tbody > tr'
                        },
                        column_params: [
                            {
                                name: 'date',
                                label: 'Date',
                                selector: 'th[data-data="date"]'
                            },
                            {
                                name: 'totalComm',
                                label: 'Commissions - Total',
                                selector: 'th[data-data="totalComm"]'
                            },
                            {
                                name: 'netSaleCount',
                                label: 'Sales - Net',
                                selector: 'th[data-data="netSaleCount"]'
                            },
                            {
                                name: 'netLeadCount',
                                label: 'Leads - Net',
                                selector: 'th[data-data="netLeadCount"]'
                            },
                            {
                                name: 'clickCount',
                                label: 'Clicks',
                                selector: 'th[data-data="clickCount"]'
                            },
                            {
                                name: 'EPC',
                                label: 'EPC',
                                selector: 'th[data-data="EPC"]'
                            },
                            {
                                name: 'impCount',
                                label: 'Impressions',
                                selector: 'th[data-data="impCount"]'
                            },
                            {
                                name: 'CR',
                                label: 'CR',
                                selector: 'th[data-data="CR"]'
                            }
                        ],
                    }
                },
                success: {
                   selector: 'table[data-url="dates"] > tbody > tr:nth-child(2)'
                }
            },
            model_mappings: { // Potentially this can include only the fields where names are different btw API and app model
                target: 'Performance',
                fields: {
                        date: 'date',
                        commissions: 'totalComm',
                        sales: 'netSaleCount',
                        leads: 'netLeadCount',
                        clicks: 'clickCount',
                        epc: 'EPC',
                        impressions: 'impCount',
                        cr: 'CR'
                },
                dbTable: 'performance'
            }
            // TODO: add potential data transformation/normalization instructions (e.g.: truncate, string splits, string joins, symbol trim/s, etc, etc)
        }
    }
}
module.exports = WEB_CONFIG;