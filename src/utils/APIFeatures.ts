class APIFeatures {
    query: any;
    queryStr: any;
    constructor(query: any, queryStr: any) {
      this.query = query;
      this.queryStr = queryStr;
    }
    filter() {
      //1. filtering
      console.log(this.queryStr);
      //1.1 remove unwanted Query e.g page , sort , limit , fields
      const qureyObj = { ...this.queryStr };
      const excludeFields = ["page", "sort", "limit", "fields"];
      excludeFields.forEach((el) => delete qureyObj[el]);
      console.log(qureyObj);
      // 1.2 Advance Filtering
      let queryStr = JSON.stringify(qureyObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      console.log(queryStr);
      //query build => Select * from tours where duration = 5
    //   this.query = SELECT * FROM users where (JSON.parse(queryStr))
        queryStr = JSON.parse(queryStr);
        console.log(typeof(this.query));
        console.log(this.query);
      this.query = this.query.findAll({ where: queryStr});
      console.log("End......");
      return this;
    }
    sort() {
      // 2. sort
      if (this.queryStr.sort) {
        console.log(">>>>>>");
        const sortBy = this.queryStr.sort.split(",").join(" ");
        console.log(sortBy);
        // this.query = this.query.sort(sortBy); //query => Select * from tours where order by price
        this.query = this.query({where:{ order:[sortBy]}});
        this.query = this.query();
        console.log("<<<<<<");
      } else {
        this.query = this.query({where:{ order:["-createdAt"]}});
      }
      return this;
    }
    limit() {
      //3. Field Limiting
      if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(",").join(" ");
        this.query = this.query(fields);
      } else {
        //3.1 Default Field Limiting
        // this.query = this.query.select("-__v");
        //select * 
      }
      return this;
    }
    pagination() {
      //4. Pagination
  
      const page = this.queryStr.page * 1 || 1; //page = 1, 2
      const limit = this.queryStr.limit * 1 || 10; // limit = 10
      const skip = (page - 1) * limit;
  
    //   this.query = this.query.skip(skip).limit(limit);
      this.query = this.query({ offset: skip, limit: limit})
      return this;
    }
  }
  module.exports = APIFeatures;
  