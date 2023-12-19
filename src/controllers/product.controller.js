const httpStatus = require("http-status");
const ApiSuccess = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const { productService } = require("../services");
const pick = require("../utils/pick");

const addProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user._id);
  return new ApiSuccess(res, httpStatus.CREATED, "Product added successfully", product);
})

const editProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.body, req.params.productId);
  return new ApiSuccess(res, httpStatus.OK, "Product updated successfully", product);
})

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.productId, req.user._id)
  return new ApiSuccess(res, httpStatus.NO_CONTENT, "Product deleted successfully")
})

const getAllProductsByBeautician = catchAsync(async (req, res) => {
  const products = await productService.getAllProductsByBeautician(req.query.beauticianId);
  return new ApiSuccess(res, httpStatus.OK, "Products by beautician", products)
})

const getProductDetails = catchAsync(async (req, res) => {
  const product = await productService.getProductDetails(req.params.productId);
  return new ApiSuccess(res, httpStatus.OK, "Product details fetched successfully", product)
})

module.exports = {
  addProduct,
  getAllProductsByBeautician,
  deleteProduct,
  getProductDetails,
  editProduct
}