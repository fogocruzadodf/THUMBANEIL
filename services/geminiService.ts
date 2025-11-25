import { GoogleGenAI, Modality, Part } from "@google/genai";

const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';
const CORRECTION_MODEL_NAME = 'gemini-2.5-pro';

const getAspectRatioPrompt = (aspectRatio: string): string => {
  switch (aspectRatio) {
    case '16:9':
      return 'Generate a widescreen 16:9 aspect ratio image, perfect for a YouTube thumbnail. The composition should be horizontal and cinematic.';
    case '1:1':
      return 'Generate a square 1:1 aspect ratio image, ideal for an Instagram grid post. The composition should be balanced within the square frame.';
    case '4:5':
      return 'Generate a vertical 4:5 aspect ratio image, suitable for an Instagram portrait post. The composition should be taller than it is wide.';
    case '9:16':
      return 'Generate a tall, vertical 9:16 aspect ratio image, perfect for Instagram Stories or Reels. The composition should be strongly vertical.';
    default:
      return `Generate the final image with a ${aspectRatio} aspect ratio.`;
  }
};

const getDefaultPrompt = (topText: string, mainTextLine1: string, mainTextLine2: string, aspectRatioDescription: string): string => `
    You are a world-class visual artist and professional thumbnail designer, renowned for creating hyper-realistic, A-list movie poster quality graphics for high-engagement social media channels.
    Your mission is to integrate text into the provided character image, elevating it into a breathtaking, photorealistic thumbnail that stops viewers from scrolling.

    **CORE PHILOSOPHY: REALISM is everything.** The final image must look like a high-budget photograph, not a digital composite.

    **CRITICAL EXECUTION DIRECTIVES:**
    1.  **Output Quality: Ultra HD 4K.** The image must be rendered in stunning 4K resolution. Every detail, texture, and light reflection should be incredibly sharp and clear, free of any compression artifacts. The quality should be equivalent to a high-end cinematic production still.
    2.  **Character Integrity:** The original character is sacred. You MUST preserve their appearance, pose, expression, and details 100%. DO NOT change them.
    3.  **Dynamic Background Generation:** Discard generic templates. Create a dynamic, photorealistic background that is contextually relevant to the character or text. It should have depth, realistic textures, and cinematic lighting.
    4.  **Text Integration - The Art of Realism:**
        -   The text must look physically present in the scene. It should cast realistic shadows on the background and character. If there are light sources, the text should catch highlights and reflections.
        -   **Top Right Text:** Add "${topText}". Use a clean, bold, sans-serif font. Ensure it's perfectly readable but subtly integrated.
        -   **Main Text (Line 1):** Add "${mainTextLine1}". Use a powerful, large, sans-serif font. Give it a three-dimensional quality with soft, realistic shadows.
        -   **Main Text (Line 2):** Add "${mainTextLine2}". This is the star. Make it even larger. Use a premium, textured material like brushed metal, gold foil, or glowing neon, depending on what fits the scene. The lighting effects on this text must be flawless and interact with the environment.
    5.  **Masterful Composition & Post-Processing:**
        -   The final composition must be balanced, impactful, and draw the eye to the character and main text.
        -   Apply subtle post-processing effects: cinematic color grading, a hint of lens flare if appropriate, and realistic grain to unify all elements.
    6.  **Target Aspect Ratio:** ${aspectRatioDescription} Every compositional choice must serve this format perfectly. For 16:9, think cinematic widescreen. For 1:1, think balanced and centered.
`;

const getBackgroundPrompt = (topText: string, mainTextLine1: string, mainTextLine2: string, aspectRatioDescription: string): string => `
    You are an expert photo compositor and visual effects artist.
    Your task is to take a character image [Image 1] and seamlessly integrate it into a background image [Image 2], then add text to create a stunning, realistic thumbnail.

    **CORE PHILOSOPHY: Photorealism is paramount.** The final image must look like a single, professionally shot photograph, not a cut-and-paste composite.

    **CRITICAL EXECUTION DIRECTIVES:**
    1.  **Output Quality: Ultra HD 4K.** The image must be sharp, detailed, and free of artifacts.
    2.  **Character Integrity:** The character from [Image 1] must be perfectly preserved. Do not alter their pose, expression, or appearance.
    3.  **Seamless Compositing:**
        -   Place the character from [Image 1] into the background from [Image 2].
        -   **Crucial Lighting Match:** You MUST re-light the character to match the lighting of the background perfectly. This includes direction, color, and softness of light.
        -   **Realistic Shadows:** The character must cast accurate and soft shadows onto the background, grounding them in the scene.
    4.  **Text Integration - The Art of Realism:**
        -   The text must look physically present in the scene. It should cast realistic shadows and receive light from the environment.
        -   **Top Right Text:** Add "${topText}".
        -   **Main Text (Line 1):** Add "${mainTextLine1}".
        -   **Main Text (Line 2):** Add "${mainTextLine2}". Make this text powerful and visually dominant.
    5.  **Final Polish:** Apply subtle color grading and effects to unify the character, background, and text into a cohesive, cinematic image.
    6.  **Target Aspect Ratio:** ${aspectRatioDescription}. Compose the final image to fit this format perfectly.
`;

const getBackgroundAndStylePrompt = (topText: string, mainTextLine1: string, mainTextLine2: string, aspectRatioDescription: string): string => `
    You are a world-class visual director, combining the skills of a compositor, a lighting artist, and a style guru.
    You have three inputs: [Image 1] is the subject (character), [Image 2] is the environment (background), and [Image 3] is the style guide.
    Your mission is to create a single, breathtaking thumbnail that places the character into the background, all while conforming to the artistic style of the reference image.

    **CORE PHILOSOPHY: Masterful Artistic Synthesis.** The result must be a unified, cinematic masterpiece, not a disjointed combination.

    **CRITICAL EXECUTION DIRECTIVES:**
    1.  **Output Quality: Ultra HD 4K.** The final image must be of impeccable, professional quality.
    2.  **Role of Each Image:**
        -   **[Image 1] The Character:** Preserve the character's form and identity completely. This is your actor.
        -   **[Image 2] The Set:** Use this as the foundational background environment. This is your location.
        -   **[Image 3] The Style Bible:** This image dictates the final look. Analyze its lighting, color grading, textures, and typography. This is your visual script.
    3.  **Execution Steps:**
        a.  **Composite:** Place the Character [Image 1] into the Set [Image 2].
        b.  **Re-Style:** Apply the complete artistic style of the Style Bible [Image 3] to the combined scene. This includes:
            -   **Lighting & Color:** Re-light the entire scene (character and background) to perfectly match the mood, color palette, and light quality of [Image 3].
            -   **Texture & Atmosphere:** Infuse the scene with the same textures, grain, and overall atmosphere from [Image 3].
        c.  **Apply Styled Text:** Add the following text, but style it *identically* to the typography in the Style Bible [Image 3]. Replicate the font, color, effects, and placement logic.
            -   Top Right Text: "${topText}"
            -   Main Text (Line 1): "${mainTextLine1}"
            -   Main Text (Line 2): "${mainTextLine2}"
    4.  **Target Aspect Ratio:** ${aspectRatioDescription}. The final composition must be perfectly framed for this format, respecting the principles of the reference style.
`;

const getStyleReferencePrompt = (topText: string, mainTextLine1: string, mainTextLine2: string, aspectRatioDescription: string): string => `
    You are a master style transfer artist and a hyper-realistic compositor.
    You are given two images: [Image 1] is the subject (a character), and [Image 2] is the style bible (a reference image).
    Your task is to flawlessly transplant the character from [Image 1] into the universe of [Image 2], making it look like they were originally photographed in that scene.

    **CORE PHILOSOPHY: Seamless Integration.** The result must be indistinguishable from a single, original piece of art. It should not look like a collage.

    **CRITICAL EXECUTION DIRECTIVES:**
    1.  **Output Quality: Ultra HD 4K.** The final composited image must be in breathtaking 4K resolution. All elements, whether from the character image or the style reference, must be perfectly sharp, detailed, and seamlessly blended without any loss of quality.
    2.  **Style Deconstruction:** Meticulously analyze the style reference [Image 2]. Deconstruct its core components:
        -   **Lighting & Color:** What is the direction, color, and quality of light? What is the overall color grade?
        -   **Texture & Materials:** Note the surfaces, grain, and materials present.
        -   **Typography:** Analyze the font choice, color, textures, shadows, and placement of any text.
        -   **Atmosphere:** What is the mood? Is it gritty, clean, futuristic, magical?
    3.  **Character Integrity:** The character from [Image 1] is the non-negotiable subject. Preserve their form, pose, and identity completely.
    4.  **Hyper-Realistic Compositing:**
        -   **Re-Lighting:** You MUST re-light the character to perfectly match the lighting conditions of the style reference. This includes casting new, accurate shadows onto the new background and having the new environment's light wrap around the character.
        -   **Environment Reconstruction:** Build a new background for the character that is a seamless extension of the style reference's world.
        -   **Text Application:** Add the following text, but style it *identically* to the typography in the style reference. Replicate the font, color, effects, and placement logic.
            -   Top Right Text: "${topText}"
            -   Main Text (Line 1): "${mainTextLine1}"
            -   Main Text (Line 2): "${mainTextLine2}"
    5.  **Final Polish:** Unify the final image with matching color grading, film grain, and atmospheric effects from the reference image.
    6.  **Target Aspect Ratio:** ${aspectRatioDescription} The composition must be perfectly adapted for this format, honoring the principles of the reference style.
`;


export const correctPortugueseText = async (text: string): Promise<string> => {
  if (!text.trim()) {
    return text;
  }
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `Você é um revisor de texto de elite, especializado em português do Brasil. Sua única e exclusiva função é corrigir erros ortográficos e gramaticais no texto que receber.
REGRAS ESTRITAS:
1. CORRIJA APENAS: Altere somente o que for estritamente necessário para corrigir a gramática e a ortografia.
2. NÃO ADICIONE NADA: Não adicione palavras, frases, explicações, ou qualquer texto extra.
3. MANTENHA O SENTIDO: O significado original, a intenção, a capitalização e o estilo devem ser 100% preservados.
4. SAÍDA LIMPA: Sua resposta deve ser *exclusivamente* o texto corrigido. Sem aspas, sem markdown, sem 'Texto corrigido:'. Apenas o texto.`;

  try {
    const response = await ai.models.generateContent({
      model: CORRECTION_MODEL_NAME,
      contents: text,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1,
      },
    });
    
    let correctedText = response.text.trim();
    // Clean up potential unwanted prefixes or formatting, just in case.
    correctedText = correctedText.replace(/^```(português|pt)?\s*|\s*```$/g, '');
    correctedText = correctedText.replace(/^"|"$/g, '');
    correctedText = correctedText.replace(/^(Aqui está o texto corrigido:|Texto Corrigido:)\s*/i, '');
    return correctedText.trim() || text;

  } catch (error) {
    console.error("Error correcting text:", error);
    return text;
  }
};


export const generateThumbnail = async (
  base64ImageData: string,
  mimeType: string,
  topText: string,
  mainTextLine1: string,
  mainTextLine2: string,
  aspectRatio: string,
  backgroundBase64?: string,
  backgroundMimeType?: string,
  styleReferenceBase64?: string,
  styleReferenceMimeType?: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const aspectRatioDescription = getAspectRatioPrompt(aspectRatio);

  const parts: Part[] = [
    {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    },
  ];
  
  let prompt: string;

  if (backgroundBase64 && backgroundMimeType) {
    parts.push({
      inlineData: { data: backgroundBase64, mimeType: backgroundMimeType },
    });
    if (styleReferenceBase64 && styleReferenceMimeType) {
      parts.push({
        inlineData: { data: styleReferenceBase64, mimeType: styleReferenceMimeType },
      });
      prompt = getBackgroundAndStylePrompt(topText, mainTextLine1, mainTextLine2, aspectRatioDescription);
    } else {
      prompt = getBackgroundPrompt(topText, mainTextLine1, mainTextLine2, aspectRatioDescription);
    }
  } else {
    if (styleReferenceBase64 && styleReferenceMimeType) {
      parts.push({
          inlineData: {
              data: styleReferenceBase64,
              mimeType: styleReferenceMimeType,
          }
      });
      prompt = getStyleReferencePrompt(topText, mainTextLine1, mainTextLine2, aspectRatioDescription);
    } else {
      prompt = getDefaultPrompt(topText, mainTextLine1, mainTextLine2, aspectRatioDescription);
    }
  }

  parts.push({ text: prompt });
    
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL_NAME,
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
        return part.inlineData.data;
    }
  }

  throw new Error("Could not extract image data from Gemini response.");
};