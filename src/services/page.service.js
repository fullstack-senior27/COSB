const { Page } = require("../models")

const createPage = async (pageBody) => {
  const page = await Page.create(pageBody);

  return page;
}

const getAllPages = async () => {
  const pages = await Page.find();
  return pages
}

const getPageByKey = async (key) => {
  console.log(key);
  const page = await Page.findOne({ key: key });
  return page;
}

const deletePage = async (pageId) => {
  const page = await Page.findByIdAndDelete(pageId);
  return page
}

const updatePage = async (pageId, updateBody) => {
  const page = await Page.findById(pageId);
  Object.assign(page, updateBody)
  await page.save()
  return page;
}
module.exports = {
  createPage,
  getAllPages,
  getPageByKey,
  deletePage,
  updatePage
}