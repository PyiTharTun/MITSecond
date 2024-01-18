const  BookDetailModel = (sequelize: any, Sequelize: any) => {
  const BookDetails = sequelize.define("book_details", {
    bookdetailid: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookname: {
      notEmpty: true,
      type: Sequelize.STRING,
    },
    booktype: {
      type: Sequelize.STRING,
      notEmpty: true,
      validate: {
        isIn: [
          [
            "Fantasy",
            "Science",
            "Fiction",
            "Adventure",
            "Romance",
            "Horror",
            "History",
            "Story",
          ]
        ],
      },
    },
    price: {
      type: Sequelize.FLOAT,
      notEmpty: true,
    },
    stockquantity: {
      type: Sequelize.INTEGER,
    }

  });

  return BookDetails;
};

module.exports = BookDetailModel;