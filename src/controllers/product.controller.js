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
  const products = await productService.getAllProductsByBeautician(req.body.beauticianId);
  const options = pick(req.query, ['limit', 'page'])
  const page = parseInt(options.page) || 1; // Current page, default to 1 if not provided
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedProducts = products.slice(skip, skip + limit);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Products fetched successfully',
    isSuccess: true,
    data: {
      results: paginatedProducts,
      totalPages: Math.ceil(products.length / limit),
      currentPage: page,
      limit: limit,
      totalResults: paginatedProducts.length
    }
  })
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