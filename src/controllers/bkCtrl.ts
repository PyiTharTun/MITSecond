const APIFeature = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/appError");
const mydb = require("../models/postgremodel");
const Books = mydb.book;
const BookDetails = mydb.bookdetail;
const OrderDetails = mydb.orderdetail;

exports.healthcheck = (req: any, res: any) => {
  console.log(">>>>>HealthCheck");
  res.status(200).json({
    status: "success",
    message: "User Health check successfully.",
  });
};

exports.lists = catchAsync(async (req: any, res: any, next: any) => {
  try {
    console.log(req.query);
    const books = await Books.findAll();
    res.status(200).json({
      status: "success",
      results: books.length,
      books,
    });
  } catch (err: any) {
    res.status(401).json({
      status: "fail",
      message: "Some went wrong when getting the data!",
      err,
    });
  }
});

exports.listsF = catchAsync(async (req: any, res: any, next: any) => {
  console.log(req.query);

  const books = await Books.findAll({
    where: req.query,
    include: [
      // { model: OrderDetails, attributes: [] },
      { model: BookDetails, as: "book_details" },
    ],
  });
  res.status(200).json({
    status: "success",
    results: books.length,
    books,
  });
  // .catch((err: any)=>{
  //     res.status(401).json({
  //         status: "fail",
  //         message: "Some went wrong when getting the data!",
  //         err
  //     })
  // })
});
exports.save = catchAsync(async (req: any, res: any, next: any) => {
  console.log(req.body);
  if (!req.body.counterNo || !req.body.cashierName) {
    return next(
      new AppErr("counterNo or cashierName or orderDate cannot be empty", 400)
    );
  }
  // const existedUser = await Books.findAll({ where: {email: req.body.email},
  //     });
  // console.log("Existinggggg....")
  // console.log(existedUser);
  // if (existedUser.length > 0){
  //     return next(
  //         new AppErr("User already existed. Try login! ")
  //     )
  // }
  // const hashedPassord = await bcrypt.hash(req.body.password, 10);
  const books = await Books.create({
    // id: req.body.id,
    counterNo: req.body.counterNo,
    cashierName: req.body.cashierName,
    orderDate: req.body.orderDate,
    refund: req.body.refund,
    discount: req.body.discount,
    discPercentage: req.body.discPercentage,
  });
  // const token = signtoken(user.id);

  res.status(200).json({
    status: "success",
    message: "User has been created successfully.",
    books,
    // token,
  });
});
exports.createBulk = catchAsync(async (req: any, res: any, next: any) => {
  for (const item of req.body) {
    const itemIndex = req.body.indexOf(item);
    if (!item.counterNo || !item.cashierName) {
      return next(
        new AppErr(
          `counterNo or cashierName in index ${itemIndex}cannot be empty`,
          400
        )
      );
    }
  }
  const books = await Books.bulkCreate(req.body);

  res.status(200).json({
    status: "success",
    message: "Users have been created successfully.",
    books,
  });
});

exports.delete = catchAsync(async (req: any, res: any) => {
  console.log("In DeleteOne....");
  if (!req.params.orderID) {
    return res.status(400).send({
      message: "require Book ID to delete!",
    });
  }
  //Delete all book data
  if (req.params.orderID === "*") {
    Books.destroy({
      where: {},
    });
    return res.status(201).send({
      status: "success",
      message: "All books is successfully deleted.",
    });
  }
  Books.destroy({
    where: {
      orderID: req.params.orderID,
    },
  })
    .then((data: any) => {
      return res.status(201).send({
        status: "success",
        message: "The Book is successfully deleted.",
        data,
      });
    })
    .catch((err: Error) => {
      return res.status(500).json({
        status: "fail",
        message: err.message || "Some error occur while deleting the book!",
      });
    });
});
exports.updateBook = catchAsync(async (req: any, res: any, next: any) => {
  if (!req.params.orderID) {
    return next(new AppErr("Book ID is required to update data!", 401));
  }
  var strBook = await Books.findByPk(req.params.orderID);
  // console.log(strUser);
  if (!strBook) {
    return next(
      new AppErr(
        `Book not found with such ID ${req.params.orderID} in the database`,
        404
      )
    );
  }
  const objBook = { ...strBook };
  // console.log("OBJUSER<<<<")
  // console.log(objUser);
  const books = objBook.dataValues;
  console.log("Book>>>>>>");
  console.log(books);
  const changeData = req.body;
  // /////////

  const excludeFields = ["createdAt", "updatedAt"];
  excludeFields.forEach((el) => delete changeData[el]);
  console.log(changeData);
  console.log(books.orderID);
  const updated = await Books.update(changeData, {
    where: { orderID: books.orderID },
  });
  res.status(200).send({
    status: "success",
    updated,
  });
});

// common controller function for fetching details
const fetchDetails = async (model: any, req: any, res: any) => {
  try {
    console.log(req.query);
    const includeArray = [];
    const dummyInstance = new model(); // Create a dummy instance
    if (dummyInstance instanceof Books) {
      includeArray.push({ model: BookDetails });
    } else if (dummyInstance instanceof OrderDetails) {
      includeArray.push({ model: BookDetails }, { model: Books });
    } else if (dummyInstance instanceof BookDetails) {
      includeArray.push({ model: Books });
    } else {
      console.log(
        "Only Books, BookDetails or OrderDetails model are allowed!!!"
      );
    }
    let whereConditions: any = {};

    // Create where conditions based on req.query
    for (const field in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, field)) {
        // Check for special conditions in the field name
        //price_gte=20 
        const [fieldName, condition] = field.split("_"); // Assuming conditions are appended to the field with an underscore
        if (condition) {
          // If a condition is specified, use it in the where clause
          whereConditions[fieldName] = {
            [mydb.Sequelize.Op[condition]]: req.query[field],
          };
        } else {
          // Otherwise, treat it as an exact match
          whereConditions[field] = req.query[field];
        }
      }
    }
    console.log(whereConditions, "This is WhereConditions..");
    const details = await model.findAll({
      where: whereConditions,
      include: includeArray,
    });
    res.status(200).json({
      status: "success",
      results: details.length,
      details,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: `Something went wrong when getting the ${model.name} data!`,
      err,
    });
  }
};
// common controller function for fetching details for Create
const createDetails = async (
  model: any, // Replace 'any' with the actual Sequelize model type
  req: any,
  res: any,
  next: any
) => {
  try {
    let requiredFields: any[] = [];
    for (const item of req.body) {
      const itemIndex = req.body.indexOf(item);
      if (model === "BookDetails") {
        requiredFields = ["bookname", "booktype", "price"]; // Define required fields here for BookDetails
      }
      if (model === "OrderDetails") {
        requiredFields = ["order_id", "book_detail_id", "price", "quantity"];
      }

      const missingField = requiredFields.find((field) => !item[field]);
      if (missingField) {
        return next(
          new AppErr(
            `${missingField} in index ${itemIndex} cannot be empty`,
            400
          )
        );
      }
    }

    const details = await model.bulkCreate(req.body);

    res.status(200).json({
      status: "success",
      message: `${model.name} details have been created successfully.`,
      details,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: `Something went wrong when creating ${model.name} details!`,
      err,
    });
  }
};
// Common function for updating details
const updateDetails = async (
  model: any, // Replace 'any' with the actual Sequelize model type
  idParam: string,
  req: any,
  res: any,
  next: any
) => {
  try {
    console.log(req.params.bookdetailid, "Params");
    console.log(idParam, "IdParams");
    if (!req.params[idParam]) {
      return next(
        new AppErr(`${model.name} ID is required to update data!`, 401)
      );
    }

    const details = await model.findByPk(req.params[idParam]);

    if (!details) {
      return next(
        new AppErr(
          `${model.name} not found with such ID ${req.params[idParam]} in the database`,
          404
        )
      );
    }
    const objDetails = { ...details };
    const detailsData = objDetails.dataValues;
    const changeData = req.body;

    const excludeFields = ["createdAt", "updatedAt"];
    excludeFields.forEach((el) => delete changeData[el]);

    const updated = await model.update(changeData, {
      where: { [idParam]: detailsData[idParam] },
    });

    res.status(200).send({
      status: "success",
      updated,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: `Something went wrong when updating ${model.name} details!`,
      err,
    });
  }
};

// common controller function for delete
const deleteDetails = async (
  model: any,
  idParam: any,
  req: any,
  res: any,
  next: any
) => {
  console.log("In DeleteOne....");
  let { [idParam]: detail_id } = req.params;
  console.log(req.params);
  console.log(detail_id);
  if (!detail_id) {
    return next(
      new AppErr(`${(model.name, idParam)} is required to delete!`, 400)
    );
  }

  if (detail_id === "*") {
    console.log("In delete all ");
    // Delete all books data
    await model.destroy({
      where: {},
    });

    return res.status(201).send({
      status: "success",
      message: `All ${model.name} have been successfully deleted.`,
    });
  }

  // Delete books with the specified order IDs
  const deletedBooks = await model.destroy({
    where: {
      // [idParam]: detailIDs,
      [idParam]: JSON.parse(`[${detail_id}]`), // Change string array into Object
    },
  });

  if (deletedBooks > 0) {
    return res.status(201).send({
      status: "success",
      message: `All records with ${idParam}: ${detail_id.join(
        ", "
      )} have been successfully deleted.`,
    });
  } else {
    return next(
      new AppErr(
        `No details found with ${idParam}: ${detail_id.join(", ")}.`,
        400
      )
    );
  }
};

// BookDetail controller
exports.bookDetailList = catchAsync(async (req: any, res: any) => {
  await fetchDetails(BookDetails, req, res);
});
exports.bookDetailCreate = async (req: any, res: any, next: any) => {
  await createDetails(BookDetails, req, res, next);
};
export const updateDetailBooks = catchAsync(
  async (req: any, res: any, next: any) => {
    await updateDetails(BookDetails, "bookdetailid", req, res, next);
  }
);
exports.deleteDetailBooks = catchAsync(
  async (req: any, res: any, next: any) => {
    await deleteDetails(BookDetails, "bookdetailid", req, res, next);
  }
);

// OrderDetail controller
exports.orderDetailList = catchAsync(async (req: any, res: any) => {
  await fetchDetails(OrderDetails, req, res);
});
exports.orderDetailCreate = async (req: any, res: any, next: any) => {
  await createDetails(OrderDetails, req, res, next);
};
export const updateOrderDetail = catchAsync(
  async (req: any, res: any, next: any) => {
    await updateDetails(OrderDetails, "orderdetail_id", req, res, next);
  }
);
exports.deleteOrderDetails = catchAsync(
  async (req: any, res: any, next: any) => {
    await deleteDetails(OrderDetails, "orderdetail_id", req, res, next);
  }
);
