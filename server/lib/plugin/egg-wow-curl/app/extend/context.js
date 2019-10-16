'use strict';

module.exports = {
    async curl(expect, config) {
        return await this.app.validate.check(this.request.body, expect, config);
    },
};
