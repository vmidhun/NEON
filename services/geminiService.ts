import { Task } from "../types";
import { API_BASE_URL } from "../AuthContext";

export const suggestDailyPlan = async (tasks: Task[]): Promise<Partial<Task>[]> => {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/gemini/suggest-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ tasks }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Backend API error: ${response.statusText}`);
    }

    const suggestedPlan = await response.json();

    return suggestedPlan.map((p: any) => ({
        id: p.id,
        allocatedHours: p.allocatedHours
    }));
  } catch (error) {
    console.error("Error generating daily plan via backend:", error);
    throw new Error("Failed to generate a daily plan. " + (error instanceof Error ? error.message : ""));
  }
};