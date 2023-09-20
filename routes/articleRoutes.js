const articleController = require("../app/controller/articleController");
const authMiddleware = require("../app/middleware/authMiddleware")
function initRoutes(app) {
  //*********************************   API routes  **************************** *//

  // Article Recommendation
  app.get("/recommended-articles",authMiddleware, articleController().recommendedArticles);
  // Save Artical
  app.post("/save-article", authMiddleware,articleController().saveArticle);
  // Fetch Artical
  app.get("/save-article",authMiddleware, articleController().getArticle);
  // delete Artical
  app.delete("/delete-article/:id",authMiddleware, articleController().deleteArticleById);
  //Get User Interest 
  app.get('/user/interests', articleController().getUserInterest)
  // Update User Interest
  app.post('/user/interests',authMiddleware, articleController().updateUserInterest)
  // news-feed
  app.get('/news-feed',authMiddleware, articleController().newsFeed)
}
module.exports = initRoutes;