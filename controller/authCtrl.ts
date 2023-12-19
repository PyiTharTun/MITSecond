const AuthErrors = require('../utils/appError');
exports.restrictTo = (...roles: any) => {
    console.log("aaaa");
    return (req:any, res: any, next:any) => {
        console.log("BBBBBBB");
      if (!roles.includes(req.body.role)) {
        return next(
          new AuthErrors("You do not have permission to perform this action.", 403)
        );
      }
      next();
    };
  };
  