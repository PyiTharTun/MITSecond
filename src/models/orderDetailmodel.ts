const { DataTypes } = require('sequelize');
const book_detail = require("./bookDetailmodel");

const orderDetailModel = (sequlize: any, Sequelize: any) => {
  const OrderDetails = sequlize.define("order_details", {
    orderdetail_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // order_id: {
    //   notEmpty: true,
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: "book_net", //foreign table
    //     key: "orderID", // key in foreign table
    //   },
    // },
    // book_detail_id: {
    //   type: DataTypes.INTEGER,
    //   notEmpty: true,
    //   references: {
    //     model: "book_details",
    //     key: "bookdetailid",
    //   },
    // },
    price: {
      type: Sequelize.FLOAT,
    },
    quantity: {
      type: Sequelize.INTEGER,
      notEmpty: true,
      defaultValue: 1,
    },
    discount_percentage: {
      type: Sequelize.FLOAT,
      defaultValue: null,
    },
    rechange: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });



//   book.belongsToMany(book_detail, { through: OrderDetails });
//   book_detail.belongsToMany(book, { through: OrderDetails });
  return OrderDetails;
};

module.exports = orderDetailModel;
