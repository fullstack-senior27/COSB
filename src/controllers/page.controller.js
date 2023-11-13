const httpStatus = require("http-status");
const { pageService } = require("../services");
const ApiSuccess = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");

const createPage = catchAsync(async (req, res) => {
  const page = await pageService.createPage(req.body);
  return new ApiSuccess(res, httpStatus.OK, "Created successfully", page)
})

const getAllPages = catchAsync(async (req, res) => {
  const pages = await pageService.getAllPages()
  return new ApiSuccess(res, httpStatus.OK, "Fetched all pages successfully", pages)
})

const getPageByKey = catchAsync(async (req, res) => {
  const page = await pageService.getPageByKey(req.params.key)
  return new ApiSuccess(res, httpStatus.OK, "Feteched page successfully", page)
})

const deletePage = catchAsync(async (req, res) => {
  const page = await pageService.deletePage(req.params.pageId);
  return new ApiSuccess(res, httpStatus.NO_CONTENT, "Page deleted successfully", page)
})

const updatePage = catchAsync(async (req, res) => {

  const page = await pageService.updatePage(req.params.pageId, req.body)
  return new ApiSuccess(res, httpStatus.OK, "Page updated successfully", page)
})

module.exports = {
  createPage,
  getAllPages,
  getPageByKey,
  deletePage,
  updatePage
}