const myexpress = require('express');
// const blogRouters = myexpress.Router();
const blogsCtrl = require('../controller/blogs');

module.exports = (app: any) =>{
    const router = myexpress.Router();

    // app.use('/api/v1/blogs',router);
    router.post('/newblog', blogsCtrl.create)
    router.get('/healthcheck' ,blogsCtrl.healthcheck)
    router.delete('/:id', blogsCtrl.deleteOne);
    app.use('/api/v1/blogs', router);

}
// blogRouters.post('/newblog', blogsCtrl.create).get('/healthcheck' ,blogsCtrl.healthcheck);
// module.exports = blogRouters;