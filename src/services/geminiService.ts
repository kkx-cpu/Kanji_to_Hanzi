import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

export async function getHanziInfo(kanji: string): Promise<HanziInfo> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: `ユーザーが入力した日本語の漢字「${kanji}」に対応する、または字形が似ている中国語の漢字（簡体字）の情報を教えてください。日本人学習者向けに分かりやすく説明してください。`,
    config: {
      systemInstruction: "あなたは日本人が中国語を学ぶのを助ける優秀な中国語教師です。日本語の漢字とそれに対応する中国語の漢字（簡体字）のつながり、発音、意味、そして具体的な単語の例を提示します。",
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
  return JSON.parse(text) as HanziInfo;
}
