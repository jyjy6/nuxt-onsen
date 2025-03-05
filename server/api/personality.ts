import { defineEventHandler, getQuery, readBody } from "h3";
import PersonalityModel from "../models/personality";
import { AxiosError } from "axios";

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === "GET") {
    try {
      const query = getQuery(event);
      const personalityName = query.personalityName; // personalityName 쿼리 파라미터 추출
      if (personalityName) {
        const personality = await PersonalityModel.findOne({
          personalityName,
        });
        return { success: true, data: personality };
      }

      const personalities = await PersonalityModel.find({});
      return { success: true, data: personalities };
    } catch (error) {
      return { success: false, error };
    }
  }

  if (method === "POST") {
    const body = await readBody(event);
    try {
      const newPersonality = await PersonalityModel.create(body);
      return { success: true, data: newPersonality };
    } catch (error) {
      // Log the detailed error
      console.error("Error creating personality:", error);
      if (error instanceof AxiosError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Unknown error occurred" };
    }
  }
});
