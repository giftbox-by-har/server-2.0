const getNextFit = async (products) => {
    // Collaborative Filtering
    const collaborativeFilteringRecommendations = await collaborativeFiltering(products);
  
    // Content-Based Filtering
    const contentBasedFilteringRecommendations = await contentBasedFiltering(products);
  
    // Gabungkan hasil peringkat dari kedua metode
    const recommendations = [...collaborativeFilteringRecommendations, ...contentBasedFilteringRecommendations];
  
    // Urutkan rekomendasi berdasarkan peringkat atau skor
    recommendations.sort((a, b) => b.score - a.score);
  
    // Ambil 5 produk teratas
    const topRecommendations = recommendations.slice(0, 5);
  
    return topRecommendations;
  };
  
  module.exports = { getRecommendations };