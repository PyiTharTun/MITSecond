
//import your model here
const APIFeature = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/appError");
const myusers = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = myusers.users;

exports.healthcheck = (req: any, res: any) => {
  console.log(">>>>>HealthCheck");
  res.status(200).json({
    status: "success",
    message: "User Health check successfully.",
  });
};
// module.exports.log = function (msg) { 
//     console.log(msg);
// };
const signtoken = function (id: any) {
    return jwt.sign(
      {
        id: id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  };
exports.signtoken = signtoken;

exports.createUser = catchAsync(async(req: any, res: any, next: any)=>{
    console.log(req.body);
    if (!req.body.email || !req.body.password){
        return next(
            new AppErr("email or password cannot be empty", 400)
        )
    }
    const existedUser = await Users.findAll({ where: {email: req.body.email},
        });
    console.log("Existinggggg....")
    console.log(existedUser);
    if (existedUser.length > 0){
        return next(
            new AppErr("User already existed. Try login! ")
        )
    }
    const hashedPassord = await bcrypt.hash(req.body.password, 10);
    const user = await Users.create({
        // id: req.body.id,
        email: req.body.email,
        password: hashedPassord,
        role: req.body.role ,

    })
    console.log("User ID ,,,,");
    console.log(user);
    // const token = signtoken(user.id);

    res.status(200).json({
        status: "success",
        message: "User has been created successfully.",
        user,
        // token,
    });
});

exports.getAllUser = async (req: any, res: any) => {
  try {
    // console.log("NNNNN");
    const users = await Users.findAll();
    // console.log("IINNN");
    res.status(200).json({
      status: "success",
      results: users.length,
      users,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.filteredUsers = catchAsync(async (req: any, res: any, next: any) => {
  const features = new APIFeature(Users.findAll(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();
    const users = await features.query;
    if (!users){
        return next(
            new AppErr("The server went wrong", 500)
        );
    }
    res.status(200).json({
        status: "success",
        requestAt: req.requestTime,
        result: users.length,
        users,
    });
});
exports.login = catchAsync(async(req: any, res: any, next:any)=>{
    const { email, passwords} = req.body;
    // console.log(req.body);
    // console.log(req.body.email);
    // console.log(!req.body.password);
    const Tpasswords = !req.body.password;
    //check email and password from the req.body
    if(!email||Tpasswords){
        // if(false){
        // console.log("<<<Herreeeee");
        return next(
            new AppErr("Please enter email and password!", 400),
        );
    }
    //create User Object 
    var user: any = {};
    //find the user in the database
     const StrUser = await Users.findAll({
        where: {email: email}
    })
    // console.log(StrUser);
    const objUser = {...StrUser};
    // console.log(objUser[0].dataValues["password"]);
    user.password = objUser[0].dataValues["password"];
    if(!user){
        return next(new AppErr("User is not registered", 404));
    }
    //check password 
    const match = await bcrypt.compare(req.body.password, user.password);
    // console.log(match);
    if(match == false){
        // console.log("not Match ");
        return next(new AppErr("Invalid Password", 401));
    }
    user.id = objUser[0].dataValues["id"];
    // console.log(user.id);
    const token = signtoken(user.id);
    // console.log("token");
    res.status(201).json({
        status:"log in successfully",
        userID: user.id,
        userPassword: user.password,
        token,
    });
})
exports.updateUser = catchAsync(async (req: any, res: any, next: any)=>{
    if(!req.params.id){
        return next(new AppErr("User ID is required to update data!", 401))
    }
    var strUser = await Users.findByPk(req.params.id);
    // console.log(strUser);
    if(!strUser){
        return next(new AppErr(`User not found with such ID ${req.params.id} in the database`, 404));
    }
    const objUser = {...strUser};
    // console.log("OBJUSER<<<<")
    // console.log(objUser);
    const user = objUser.dataValues;
    // console.log("User>>>>>>")
    // console.log(user);
    const changeData = req.body;
    const excludeFields = ["id","createdAt","updatedAt","password"];
     excludeFields.forEach((el)=> delete changeData[el]);
     console.log(changeData);
     console.log(user.id);
    const updated = await Users.update(changeData,{ where: { id: user.id }})
    res.status(200).send({
        status: "success",
        updated
    })
    
})


exports.deleteOne = (req: any, res: any) => {
  console.log("In DeleteOne....");
  if (!req.params.id) {
    return res.status(400).send({
      message: "require User ID to delete!",
    });
  }
  Users.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((data: any) => {
      return res.status(201).send({
        status: "success",
        message: "The user is successfully deleted.",
      });
    })
    .catch((err: Error) => {
      return res.status(500).json({
        status: "fail",
        message: err.message || "Some error occur while deleting the user!",
      });
    });
};


