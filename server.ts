// const app = require("./app");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");


// dotenv.config({ path: "./config.env" });
// console.log(process.env.port);
// const port = process.env.port;
// app.listen(port,()=>{
//     console.log("App running on port 3030...");
// })
const express = require("express");
const cors = require("cors");
const dbConnect = require('./models/index');
const blogRouter = require('./routers/blogs');
const userRouter = require('./routers/userRouter')
const dotenv = require("dotenv");
const AppErrs = require("./utils/appError");
const GlobalErrorHandler = require("./controller/errorCtrl");
dotenv.config({ path: './config/config.env'});
console.log(process.env.PORT);
const app = express();

var corsOptions = {
    origin: `*`,
};

app.use(cors(corsOptions));
app.use(express.json());
// app.use('/api/v1/blogs',blogRouter);
blogRouter(app);
userRouter(app);

// app.use('/healthcheck', blogRouter);


dbConnect.sequelize.sync().then(()=>{
    console.log("Synced db.");
}).catch((err:any)=>{
    console.log("Failed to sync db: "+ err.message);

});


app.get("/",(req:any, res:any)=>{
    res.status(200).json({
        'message': 'sever is running'
    })
});

app.all("*", (req: any, res: any, next: any) => {
    next(new AppErrs(`Can't find ${req.originalUrl} on this server.`, 404));
  });
  
  app.use(GlobalErrorHandler);

app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port ${process.env.PORT}`);
})


