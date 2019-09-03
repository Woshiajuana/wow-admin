import router                                   from './router'
import store                                    from './store'
import { Message }                              from 'element-ui'

import NProgress                                from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false });

const whiteList = ['/login'];

router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start();
    next();
    NProgress.done();
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
});
