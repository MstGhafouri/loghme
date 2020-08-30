const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('سندی با شناسه درخواستی یافت نشد', 404));

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    const modelName = Model.collection.name.slice(0, -1);

    if (!updatedDoc)
      return next(new AppError('سندی با شناسه درخواستی یافت نشد', 404));

    res.status(200).json({
      status: 'success',
      data: {
        [modelName]: updatedDoc
      }
    });
  });

exports.getOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) return next(new AppError('سندی با شناسه درخواستی یافت نشد', 404));

    const modelName = Model.collection.name.slice(0, -1);
    // Remove food parties from the restaurant's menu
    if (doc.menu) doc.menu = doc.menu.filter(food => !food.oldPrice);

    res.status(200).json({
      status: 'success',
      data: {
        [modelName]: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    const modelName = Model.collection.name.slice(0, -1);

    newDoc.password = undefined;
    newDoc.active = undefined;
    newDoc.createdAt = undefined;
    newDoc.__v = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        [modelName]: newDoc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await apiFeatures.query;
    const totalResults = await Model.countDocuments(apiFeatures.queryObj);

    res.status(200).json({
      status: 'success',
      totalResults,
      results: docs.length,
      data: {
        [Model.collection.name]: docs
      }
    });
  });
