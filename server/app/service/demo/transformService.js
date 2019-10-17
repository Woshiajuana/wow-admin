
'use strict';

const { CurlService } = require('egg');


module.exports = class HandleServer extends CurlService {

    constructor (ctx) {
        super(ctx, 'transformService');
    }

};
