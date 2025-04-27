import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createMockPlantIdentification } from '@/app/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured in environment variables');
      
      // Return a mock response for testing if no API key is available
      const mockPlant = createMockPlantIdentification();
      return NextResponse.json({ plant: mockPlant });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert File to buffer for processing
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to base64
    const base64Image = buffer.toString('base64');

    // Initialize the API client here with the key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

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
                data: base64Image
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
      const plantInfo = JSON.parse(textResponse);
      return NextResponse.json({ plant: plantInfo });
    } catch (error) {
      console.error('Failed to parse JSON response from Gemini:', textResponse);
      throw new Error('Failed to parse plant information from AI response');
    }
  } catch (error) {
    console.error('Error in plant identification API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to identify plant: ${errorMessage}` },
      { status: 500 }
    );
  }
}