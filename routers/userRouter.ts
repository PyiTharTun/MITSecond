const usrexpress = require('express');
// const blogRouters = myexpress.Router();
const userCtrl = require('../controller/usercontroller');
const authCtrl = require('../controller/authCtrl');

module.exports = (app: any) =>{
    const router = usrexpress.Router();

    // app.use('/api/v1/blogs',router);
    router.get('/all', userCtrl.getAllUser);
    router.get('/healthcheck' ,userCtrl.healthcheck);
    router.post('/login', userCtrl.login);
    router.post('/register', userCtrl.createUser);
    router.get('/filter', userCtrl.filteredUsers);
    router.delete('/:id', authCtrl.restrictTo("admin"),userCtrl.deleteOne);

    router.patch('/update/:id', userCtrl.updateUser);
    app.use('/api/v1/users', router);

}
// blogRouters.post('/newblog', blogsCtrl.create).get('/healthcheck' ,blogsCtrl.healthcheck);
// module.exports = blogRouters;
