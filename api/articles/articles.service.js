const Article = require("./articles.schema");

class ArticlesService {
  async create(articleData) {
    const article = new Article(articleData);
    return await article.save();
  }

  async update(articleId, articleData) {
    return await Article.findByIdAndUpdate(
      articleId,
      articleData,
      { new: true, runValidators: true }
    ).populate("user", "-password");
  }

  async delete(articleId) {
    return await Article.findByIdAndDelete(articleId);
  }

  async findAll() {
    return await Article.find().populate("user", "-password");
  }

  async findById(articleId) {
    return await Article.findById(articleId).populate("user", "-password");
  }

  async getByUserId(userId) {
    return Article.find({ user: userId }).populate("user", "-password");
  }
}

module.exports = new ArticlesService();
