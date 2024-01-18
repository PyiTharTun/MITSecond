const express = require("express");
const cors = require("cors");
const app = express();
const AppErrs = require("./utils/appError");
const GlobalErrorHandler = require("./controllers/errorCtrl");
const bkRouter = require("./routers/bookRouter");
const dbConnect = require("./models/postgremodel");

var corsOptions = {
  origin: `*`,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(GlobalErrorHandler);

dbConnect.book.belongsToMany(dbConnect.bookdetail, {
  through: dbConnect.orderdetail, foreignKey: 'bookNetOrderID', 
}); 
dbConnect.bookdetail.belongsToMany(dbConnect.book, {
  through: dbConnect.orderdetail, foreignKey: 'bookDetailBookdetailid', 
});
// dbConnect.orderdetail.hasOne(dbConnect.book, { foreignKey: 'bookNetOrderID'});
dbConnect.orderdetail.belongsTo(dbConnect.book , { foreignKey: 'bookNetOrderID' });
dbConnect.orderdetail.belongsTo(dbConnect.bookdetail, { foreignKey: 'bookDetailBookdetailid' });
dbConnect.sequelize
//   .sync({force: true})
  .sync()
  .then(() => {
    console.log("Synced db.");
    // for(let i =1 ; i < 4 ; i++ ){
    //     var num = i % 4 + 1
    //     const book ={
    //         counterNo: num,
    //         cashierName: `Peter${i}`
    //     }
    //     dbConnect.book.create({book});
    // }
  })
  .catch((err: any) => {
    console.log("Failed to sync db: " + err.message);
  });
app.get("/", (req: any, res: any) => {
  res.status(200).json({
    message: "sever is running",
  });
});
bkRouter(app);
app.all("*", (req: any, res: any, next: any) => {
  next(new AppErrs(`Can't find ${req.originalUrl} on this server.`, 404));
});
// app.listen(process.env.PORT,()=>{
//     console.log(`Server is listening on port ${process.env.PORT}`);
// })

module.exports = app;
