import { defineEventHandler, getQuery } from "h3";
import PersonalityModel from "../models/personality";

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
      return { success: false, error };
    }
  }
});
