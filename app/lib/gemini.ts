import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Configure the Google Generative AI client with proper API key access
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export interface PlantIdentificationResult {
  name: string;
  scientificName: string;
  description: string;
  careInstructions: {
    water: string;
    sunlight: string;
    temperature: string;
  };
  nativeRegion: string;
}

export const createMockPlantIdentification = (): PlantIdentificationResult => {
  return {
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    description: "Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama. It has large, glossy, heart-shaped leaves with distinctive holes or cuts.",
    careInstructions: {
      water: "Allow soil to dry out between waterings. Water thoroughly when the top 2-3 inches of soil feel dry.",
      sunlight: "Bright, indirect light. Avoid direct sunlight which can burn the leaves.",
      temperature: "65-85°F (18-29°C). Keep away from cold drafts and sudden temperature changes."
    },
    nativeRegion: "Southern Mexico to Panama"
  };
};

// Identify plant using Gemini
export const identifyPlant = async (imageBase64: string): Promise<PlantIdentificationResult> => {
  try {
    if (!apiKey) {
      throw new Error('Google Gemini API key is not configured. Please add it to your environment variables.');
    }

    // Get the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Set safety settings
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Create prompt for plant identification
    const prompt = `
      Analyze this image of a plant and provide the following information in JSON format:
      - name: the common name of the plant
      - scientificName: the scientific name
      - description: a brief description (2-3 sentences)
      - careInstructions: an object with the following properties:
        - water: how often to water
        - sunlight: sunlight requirements
        - temperature: temperature requirements
      - nativeRegion: where this plant is native to
      
      The response should be valid JSON only, with no additional text.
    `;

    // Generate content from the model
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64
              }
            }
          ]
        }
      ],
      safetySettings,
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      }
    });

    const response = result.response;
    const textResponse = response.text();
    
    // Parse the JSON response
    try {
      return JSON.parse(textResponse);
    } catch (error) {
      console.error('Failed to parse JSON response from Gemini:', textResponse);
      throw new Error('Failed to parse plant information from AI response');
    }
  } catch (error) {
    console.error('Error identifying plant with Gemini:', error);
    throw error;
  }
};