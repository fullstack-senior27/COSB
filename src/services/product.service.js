const httpStatus = require("http-status")
const { Product } = require("../models")
const ApiError = require("../utils/ApiError")
const { beauticianService } = require(".")

const createProduct = async ({ title, description, link, isAvailable }, beauticianId) => {
  const newProduct = await Product.create({
    title,
    description,
    link,
    isAvailable,
    beautician: beauticianId,
  })
  // const beautician = await beauticianService.getBeauticianById(beauticianId);
  // beautician.products.push(newProduct);
  // await beautician.save();
  return newProduct
}

const updateProduct = async (updateBody, productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found")
  }

  Object.assign(product, updateBody);
  await product.save();
  return product
}

const getAllProductsByBeautician = async (beauticianId) => {
  const products = await Product.find({
    beautician: beauticianId
  }).sort({ createdAt: 'desc' })

  return products;
}

const getProductDetails = async (productId) => {
  const product = await Product.findById(productId);
  return product;
}

const deleteProduct = async (productId, beauticianId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "product does not exist")
  }
  return await product.remove();
}

module.exports = {
  createProduct,
  getAllProductsByBeautician,
  getProductDetails,
  deleteProduct,
  updateProduct
}