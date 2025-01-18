import { getRecommendations as getRecommendationsService } from "../services/recommendationService.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await getRecommendationsService(userId);
    res.json(recommendations);
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
};
