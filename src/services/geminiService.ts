import { GoogleGenAI, Type, Modality } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

async function getAI(): Promise<GoogleGenAI> {
  if (aiInstance) return aiInstance;
  
  let apiKey = process.env.GEMINI_API_KEY;
  
  // In production, or if key is missing, fetch the fresh runtime key from the server
  if (import.meta.env.PROD || !apiKey || apiKey === 'undefined') {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.GEMINI_API_KEY) {
        apiKey = data.GEMINI_API_KEY;
      }
    } catch (e) {
      console.error("Failed to fetch config", e);
    }
  }
  
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API key is missing in both build and runtime environments");
  }
  
  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
}

export interface HanziInfo {
  japaneseKanji: string;
  chineseHanzi: string;
  pinyin: string;
  meaningInJapanese: string;
  nuanceOrDifference: string;
  examples: {
    chineseWord: string;
    pinyin: string;
    japaneseTranslation: string;
  }[];
}

export async function getPronunciationAudio(text: string): Promise<{data: string, mimeType: string}> {
  const ai = await getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  if (!inlineData?.data) {
    throw new Error("No audio generated");
  }
  return { data: inlineData.data, mimeType: inlineData.mimeType || 'audio/wav' };
}

export async function getHanziInfo(query: string): Promise<HanziInfo> {
  const ai = await getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: `ユーザーが入力した日本語の漢字または単語「${query}」に対応する、または意味が近い中国語（簡体字）の情報を教えてください。日本人学習者向けに分かりやすく説明してください。`,
    config: {
      systemInstruction: "あなたは日本人が中国語を学ぶのを助ける優秀な中国語教師です。日本語の漢字・単語とそれに対応する中国語（簡体字）のつながり、発音、意味、そして具体的な単語や例文を提示します。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          japaneseKanji: { type: Type.STRING, description: "入力された日本語の漢字" },
          chineseHanzi: { type: Type.STRING, description: "対応する中国語の漢字（簡体字）" },
          pinyin: { type: Type.STRING, description: "中国語の漢字のピンイン（声調記号付き）" },
          meaningInJapanese: { type: Type.STRING, description: "中国語の漢字の日本語での意味" },
          nuanceOrDifference: { type: Type.STRING, description: "日本語の漢字とのニュアンスの違いや、字形の違い（簡体字と日本の漢字の違いなど）についての簡潔な説明" },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                chineseWord: { type: Type.STRING, description: "中国語の単語例" },
                pinyin: { type: Type.STRING, description: "単語のピンイン" },
                japaneseTranslation: { type: Type.STRING, description: "単語の日本語訳" }
              },
              required: ["chineseWord", "pinyin", "japaneseTranslation"]
            },
            description: "この漢字を使った中国語の単語の例（2〜3個）"
          }
        },
        required: ["japaneseKanji", "chineseHanzi", "pinyin", "meaningInJapanese", "nuanceOrDifference", "examples"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }
  
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  try {
    return JSON.parse(cleanText) as HanziInfo;
  } catch (e) {
    console.error("Failed to parse JSON:", cleanText);
    throw new Error("Invalid JSON response from AI");
  }
}
