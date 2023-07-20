import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import { createReadStream } from "fs";

dotenv.config();

const { OPENAI_API_KEY } = process.env;
class OpenAi {
  roles = {
    USER: "user",
    ASSISTANT: "assistant",
    SYSTEM: "system",
  };

  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async chat(messages) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      return response.data.choices[0].message;
    } catch (error) {
      console.log(error.message);
    }
  }

  async transcription(filePath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        "whisper-1"
        // "gpt-3.5-turbo"
      );
      return response.data.text;
    } catch (error) {
      console.log(error.message);
    }
  }
}

export const openai = new OpenAi(OPENAI_API_KEY);
