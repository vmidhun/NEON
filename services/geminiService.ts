import { Task } from "../types";

export const suggestDailyPlan = async (tasks: Task[]): Promise<Partial<Task>[]> => {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  try {
    const response = await fetch('https://neoback-end.vercel.app/api/gemini/suggest-plan', { // Updated endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include JWT token
      },
      body: JSON.stringify({ tasks }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Backend API error: ${response.statusText}`);
    }

    const suggestedPlan = await response.json();

    // We only trust 'id' and 'allocatedHours' from the backend response
    return suggestedPlan.map((p: any) => ({
        id: p.id,
        allocatedHours: p.allocatedHours
    }));
  } catch (error) {
    console.error("Error generating daily plan via backend:", error);
    throw new Error("Failed to generate a daily plan. The backend AI service may be unavailable or misconfigured. " + (error instanceof Error ? error.message : ""));
  }
};