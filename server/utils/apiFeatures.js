module.exports = class {
  constructor(query, requestQuery) {
    this.query = query;
    this.requestQuery = requestQuery;
    this.queryObj = {};
  }

  filter() {
    // 1. BUILD QUERY
    let queryObj = { ...this.requestQuery };
    const excludedFields = ['sort', 'limit', 'fields', 'page'];
    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    queryObj = JSON.parse(queryStr);

    if ('name' in queryObj && queryObj.name) {
      queryObj.name = new RegExp(queryObj.name);
    }
    if ('foodName' in queryObj && queryObj.foodName) {
      queryObj['menu.name'] = new RegExp(queryObj.foodName);
      delete queryObj.foodName;
    }

    this.query = this.query.find(queryObj);
    this.queryObj = queryObj;
    return this;
  }

  sort() {
    // 2. SORT
    if ('sort' in this.requestQuery) {
      const sortBy = this.requestQuery.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 3. FIELD LIMITING
    if ('fields' in this.requestQuery) {
      const fields = this.requestQuery.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 4. PAGINATION
    const page = +this.requestQuery.page || 1;
    const limit = +this.requestQuery.limit || 16;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
};
