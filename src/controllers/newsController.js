import News from "../models/News.js";

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, content, tags, image } = req.body;
    //get the authenticated user username for the author field
    const author = req.user.username;
    const newNews = new News({ title, content, image, author, tags });
    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: `Error creating news ${error}` });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedNews) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: "Error updating news" });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news" });
  }
};
