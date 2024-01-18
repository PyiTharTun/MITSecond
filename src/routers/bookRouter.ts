const bkexpress = require('express');
const bkCtrl = require('../controllers/bkCtrl');

module.exports = (app: any) =>{
    console.log("in routinggg....");
    const router = bkexpress.Router();
    router.get('/healthcheck', bkCtrl.healthcheck);
    //Books 
    router.get('/lists', bkCtrl.lists);
    router.get('/listsF', bkCtrl.listsF);
    router.post('/save', bkCtrl.save);
    router.post('/import', bkCtrl.createBulk);
    router.patch('/update/:orderID', bkCtrl.updateBook);
    router.delete('/delete/:orderID', bkCtrl.delete);
    // Order Detail 
    router.get('/orderdetails/lists', bkCtrl.orderDetailList);
    router.post('/orderdetails/create', bkCtrl.orderDetailCreate);
    router.delete('/orderdetails/delete/:orderdetail_id', bkCtrl.deleteOrderDetails);
    router.patch('/orderdetails/update/:orderdetail_id', bkCtrl.updateOrderDetail);
    // Book Detail 
    router.get('/bookdetails/lists', bkCtrl.bookDetailList);
    router.post('/bookdetails/create', bkCtrl.bookDetailCreate);
    router.delete('/bookdetails/delete/:bookdetailid', bkCtrl.deleteDetailBooks);
    router.patch('/bookdetails/update/:bookdetailid', bkCtrl.updateDetailBooks);
    app.use('/api/v1/books', router);
}
