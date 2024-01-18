const server = require("./server");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
console.log("hello from nodejs & ts..")


const port = process.env.PORT;
server.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });