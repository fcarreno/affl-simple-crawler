const API_CONFIG = {
    name: 'REQRES',
    type: 'REST',
    main_url: 'https://reqres.in/api',
    resources: {
        users: {
            type: 'users',
            path: '/users',
            paginable: true,
            pagination_cfig: {
                type: 'QUERYSTRING_PARAM',
                query_string_param: 'page'
            },
            model_mappings: {
                target: 'User',
                fields: {
                    id: 'id',
                    email: 'email',
                    firstName: 'first_name',
                    lastName: 'last_name',
                    picture: 'avatar'
                }
            }
            // TODO: add potential data transformation/normalization instructions (e.g.: truncate, string splits, string joins, symbol trim/s, etc, etc)
        }
    }
}


module.exports = API_CONFIG;