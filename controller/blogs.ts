const mydb = require("../models/index");
const Blogs = mydb.blogs;


//Health cHeck
exports.healthcheck = (req: any, res: any) => {
  res.status(200).json({
    status: "success",
    message: "Health check successfully.",
  });
};

//Create and Save a new post
exports.create = (req: any, res: any) => {
  console.log(req.body);
  //Validate request
  if (!req.body.title) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Blogs.create({
    title: req.body.title,
    content: req.body.content,
    publised: req.body.published ? req.body.published : false,
  })
    .then((data: any) => {
      return res.status(201).send({
        status: "success",
        message: "Successfully created a post.",
        data,
      });
    })
    .catch((err: Error) => {
      return res.status(500).send({
        status: "fail",
        message: err.message || "Some error occured while creating the post.",
      });
    });
};
exports.deleteOne = (req: any, res: any) => {
  console.log("in delete.....");
  console.log(req.params.id);
  if (!req.params.id) {
    return res.status(400).send({
      message: "ID is required!",
    });
  }
  Blogs.destroy({
    where: {
        id: req.params.id
        }
    })
    .then((data: any) => {
      return res.status(201).send({
        status: "success",
        message: `Blog ID ${req.params.id} is successfully deleted.`,
        data,
      });
    })
    .catch((err: Error) => {
      return res.status(500).send({
        status: "falil",
        message: err.message || "Some error occured while deleting the post.",
      });
    });
};
