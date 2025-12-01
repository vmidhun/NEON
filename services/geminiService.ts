
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

// This check is to prevent crashing in environments where process.env is not defined.
const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY
  ? process.env.API_KEY
  : "";

if (!apiKey) {
  console.warn("API_KEY environment variable not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: "The unique ID of the task.",
      },
      allocatedHours: {
        type: Type.NUMBER,
        description: "The suggested number of hours to allocate for this task.",
      },
      name: {
          type: Type.STRING,
          description: "The name of the task. Keep it the same as the input."
      }
    },
    required: ['id', 'allocatedHours', 'name'],
  },
};

export const suggestDailyPlan = async (tasks: Task[]): Promise<Partial<Task>[]> => {
  if (!apiKey) {
    throw new Error("API key is not configured. Cannot call Gemini API.");
  }
  
  const taskList = tasks.map(t => `- ID: ${t.id}, Name: ${t.name}, Project: ${t.job.project.name}`).join('\n');

  const prompt = `
    I am an employee who needs to plan my workday. My required work time is 8 hours.
    Here is my list of pending tasks:
    ${taskList}

    Please organize these tasks into a logical daily work plan. 
    Allocate a reasonable amount of time (in hours, can be a decimal) for each task. 
    The total allocated time for all tasks should sum up to approximately 8 hours.
    Prioritize tasks for 'Project Phoenix' if they exist.
    Return the plan as a JSON array based on the provided schema. Only include tasks from the list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const suggestedPlan = JSON.parse(jsonText);

    // We only trust 'id' and 'allocatedHours' from the AI
    return suggestedPlan.map((p: any) => ({
        id: p.id,
        allocatedHours: p.allocatedHours
    }));
  } catch (error) {
    console.error("Error generating daily plan with Gemini:", error);
    throw new Error("Failed to generate a daily plan. The AI service may be unavailable.");
  }
};
