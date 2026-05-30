import type { SearchResultDTO } from "@/types/search/searchResult";
import api from "../api";

export const search = async (q: string): Promise<SearchResultDTO> => {
  try {
    const response = await api.get<SearchResultDTO>("/search", {
      params: { q },
    });
    return response.data;
  } catch (error) {
    console.error("Error performing search:", error);
    return { taskLists: [], tasks: [] };
  }
};
