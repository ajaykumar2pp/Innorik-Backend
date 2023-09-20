const Article = require('../model/article')
const User = require('../model/user')
var moment = require('moment');
moment().format();

function newsController() {
    return {

        //Article recoomendation 
        async recommendedArticles(req, resp) {
            try {

                const userId = req.user.userID;

                // Find the user by their userID
                const user = await User.findById(userId).populate('savedArticles');

                if (!user) {
                    return resp.status(404).json({ error: 'User not found or unauthorized' });
                }


                // Retrieve the user's saved articles from the populated 'savedArticles' field
                const savedArticles = user.savedArticles;

                // Extract interests from saved articles
                const category = savedArticles.reduce((allInterests, article) => {
                    return allInterests.concat(article.category || []);
                }, []);

                // Find articles with similar interests
                const recommendedArticles = await Article.find({
                    category: { $in: category },
                    _id: { $nin: savedArticles }, // Exclude articles the user has already saved
                })
                    .sort({ createdAt: -1 }) // Sort by the most recent articles
                    .limit(10); // Limit the number of recommended articles

                resp.status(200).json({ recommendedArticles });
            } catch (error) {
                // Handle any potential errors, e.g., database errors
                console.error('Error fetching recommended articles:', error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        },

        //  Save Article 
        async saveArticle(req, resp) {
            try {
                const { title, description, category, url } = req.body;
                console.log(req.body)
                // Validate input data
                if (!title || !description || !category || !url) {
                    return resp.status(400).json({ message: 'Missing required fields.' });
                }
                console.log(req.user)
                const userId = req.user.userID;

                // Find the user by their userID
                const user = await User.findById(userId);

                if (!user) {
                    return resp.status(404).json({ error: 'User not found or unauthorized' });
                }
                // Create a new article instance
                const newArticle = await Article.create({
                    title,
                    description,
                    category,
                    url,
                    date: moment().format('MMMM Do YYYY, h:mm:ss a')
                });

                // Save the article to the database
                const saveArticle = await newArticle.save();

                // Push the article's _id into the user's savedArticles array
                user.savedArticles.push(newArticle._id);

                // Save the updated user with the new saved article reference
                await user.save();

                resp.json({ message: 'Article saved successfully', saveArticle });
                console.log('Article saved successfully:', saveArticle);
            } catch (error) {
                console.error('Error saving article:', error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        },

        // Route to fetch saved articles
        async getArticle(req, resp) {
            try {
                const userId = req.user.userID;

                // Find the user by their userID
                const user = await User.findById(userId).populate('savedArticles');

                if (!user) {
                    return resp.status(404).json({ error: 'User not found or unauthorized' });
                }
                // Retrieve the user's saved articles from the populated 'savedArticles' field
                const savedArticles = user.savedArticles;

                resp.status(200).json({ savedArticles });

            } catch (error) {
                console.error('Error fetching saved articles:', error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        },

        // Route to delete a saved article by ID
        async deleteArticleById(req, resp) {
            try {
                const userId = req.user.userID;
                const articleId = req.params.id;

                // Find the user by their userID
                const user = await User.findById(userId);

                if (!user) {
                    return resp.status(404).json({ error: 'User not found or unauthorized' });
                }


                // Check if the articleId exists in the user's savedArticles array
                const articleIndex = user.savedArticles.indexOf(articleId);

                if (articleIndex === -1) {
                    return resp.status(404).json({ error: 'Article not found in saved articles' });
                }
                // Remove the articleId from the user's savedArticles array
                user.savedArticles.splice(articleIndex, 1);

                // Save the updated user without the deleted article reference
                await user.save();

                resp.status(200).json({ message: 'Article removed from saved articles' });
            } catch (error) {
                console.error('Error deleting article:', error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        },

        // NewsFeed articles 
        async newsFeed(req, resp) {
            try {

                const userId = req.user.userID;

                // Find the user by their userID
                const user = await User.findById(userId);

                if (!user) {
                    return resp.status(404).json({ error: 'User not found or unauthorized' });
                }
                // const { interests } = req.query;
                resp.json({
                    Interest: user.interests,
                    message: 'Interests Get successfully',
                    userId: req.user.userID,
                    userName: req.user.userName
                });
                // Fetch news articles that match the user's interests
                // const newsArticles = await Article.find({ category: { $in: interests.split(',') } });

                // resp.json(newsArticles);
            } catch (error) {
                console.error('Error fetching news feed:', error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        },

        // Route to get user interests
        async getUserInterest(req, resp) {
            try {
                const { userId } = req.query;

                // Fetch user interests by user ID
                const user = await User.findById(userId);

                if (!user) {
                    return resp.status(404).json({ error: 'User not found' });
                }

                resp.json(user.interests);
            } catch (error) {
                console.error('Error fetching user interests:', error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        },

        // Route to update user interests
        async updateUserInterest(req, resp) {
            try {
                const { interests } = req.body;
                console.log(interests)

                const userId = req.user.userID;
                console.log(userId)

                // Find the user by their userID
                const user = await User.findById(userId);

                if (!user) {
                    return resp.status(404).json({ error: 'User not found or unauthorized' });
                }

                // Update user interests by user ID
                await User.findByIdAndUpdate(userId, { $set: { interests } });

                resp.json({
                    message: 'Interests updated successfully',
                    userId: req.user.userID,
                    userName: req.user.userName

                });
            } catch (error) {
                console.error('Error updating user interests:', error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        }

    };
}
module.exports = newsController;
