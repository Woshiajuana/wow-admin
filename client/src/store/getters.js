const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    permission_routes: state => state.permission.routes,
    objAppInfo: state => state.app.objAppInfo,
    objUserInfo: state => state.user.objUserInfo,
    objDefAppInfo: state => state.app.objDefAppInfo,
};
export default getters
