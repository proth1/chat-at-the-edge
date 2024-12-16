export const callKnowledgeGraphAPI = async (query: string): Promise<string> => {
    const knowledgeGraphApiUrl = "https://mockapi.example.com/search";
  
    try {
      const response = await fetch(knowledgeGraphApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.answer || "No result found";
      } else {
        console.error("Knowledge Graph API error:", response.statusText);
        return "No result found";
      }
    } catch (err) {
      console.error("Knowledge Graph API call failed:", err);
      return "No result found";
    }
  };