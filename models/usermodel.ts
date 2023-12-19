module.exports = (sequelize: any, Sequelize: any) => {
  const Users = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      notEmpty: true,
      validate: {
        isEmail: true,
        // unique: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      notEmpty: true,
      validate: {
        min: 8,
        max: 15,
      },
    },
    role: {
      type: Sequelize.ENUM,
      values: ["user", "guide", "admin"],
      defaultValue: "user",
    },
    // passwordChangeAt: {
    //   type: Sequelize.DATE,
    // },
    // passwordResetExpired: {
    //   type: Sequelize.DATE,
    // },
    // passwordResetToken: {
    //   type: Sequelize.STRING,
    // },
  });

  return Users;
};
