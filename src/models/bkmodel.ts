const BooksModel = (sequelize: any, Sequelize: any) => {
  const Books = sequelize.define("book_nets", {
    orderID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    counterNo: {
      notEmpty: true,
      type: Sequelize.INTEGER,
    },
    cashierName: {
      type: Sequelize.STRING,
      notEmpty: true,
      validate: {
        // min: 1,
        max: 20,
      },
    },
    orderDate: {
      type: Sequelize.DATE,
      notEmpty: true,
      defaultValue: Sequelize.NOW,

    },
    refund: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    discount:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    discPercentage:{
        type: Sequelize.INTEGER,
    }

  });

  return Books;
};
module.exports = BooksModel;