import Anthropic from "@anthropic-ai/sdk";
import type { PropertyFormData } from "@/types/property";

interface GenerateInput extends PropertyFormData {
  images: string[];
}

interface GenerateOutput {
  title: string;
  description: string;
}

export async function generatePropertyContent(data: GenerateInput): Promise<GenerateOutput> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Fallback: generate locally without AI
    return generateFallback(data);
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = buildPrompt(data);

  // Build content blocks — include images if provided
  type ContentBlock = Anthropic.TextBlockParam | Anthropic.ImageBlockParam;
  const content: ContentBlock[] = [];

  if (data.images.length > 0) {
    // Send up to 3 images for analysis
    const imagesToSend = data.images.slice(0, 3);
    for (const img of imagesToSend) {
      const [header, base64] = img.split(",");
      const mediaType = (header.match(/data:(.*);base64/) ?? [])[1] as
        | "image/jpeg"
        | "image/png"
        | "image/gif"
        | "image/webp";
      if (mediaType && base64) {
        content.push({
          type: "image",
          source: { type: "base64", media_type: mediaType, data: base64 },
        });
      }
    }
  }

  content.push({ type: "text", text: prompt });

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 800,
    messages: [{ role: "user", content }],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return parseResponse(text, data);
}

function buildPrompt(data: GenerateInput): string {
  return `You are an expert real estate copywriter. Generate a compelling property listing for the following property.

Property Details:
- Type: ${data.propertyType}
- Bedrooms: ${data.bedrooms}
- Bathrooms: ${data.bathrooms}
- Area: ${data.area} sqft
- Price: ${data.price}
- Address: ${data.address}, ${data.city}
- Features: ${data.features.join(", ") || "None specified"}
- Photos provided: ${data.images.length > 0 ? "Yes — describe what you see" : "No"}

Instructions:
1. Write a punchy, compelling TITLE (max 10 words) that highlights the best feature.
2. Write a DESCRIPTION (3–4 sentences, ~80–120 words) that:
   - Opens with the most compelling selling point
   - Mentions key features naturally
   - Evokes lifestyle and emotion
   - Ends with a subtle call-to-action

Respond ONLY in this exact format:
TITLE: [your title here]
DESCRIPTION: [your description here]`;
}

function parseResponse(text: string, data: GenerateInput): GenerateOutput {
  const titleMatch = text.match(/TITLE:\s*(.+)/i);
  const descMatch = text.match(/DESCRIPTION:\s*([\s\S]+)/i);

  return {
    title: titleMatch?.[1]?.trim() ?? generateFallbackTitle(data),
    description: descMatch?.[1]?.trim() ?? generateFallbackDescription(data),
  };
}

function generateFallback(data: GenerateInput): GenerateOutput {
  return {
    title: generateFallbackTitle(data),
    description: generateFallbackDescription(data),
  };
}

function generateFallbackTitle(data: GenerateInput): string {
  const featureHighlight = data.features[0] ? ` with ${data.features[0]}` : "";
  return `Stunning ${data.bedrooms}-Bed ${data.propertyType}${featureHighlight} in ${data.city.split(",")[0]}`;
}

function generateFallbackDescription(data: GenerateInput): string {
  const featuresText =
    data.features.length > 0
      ? `Exceptional highlights include ${data.features.slice(0, 3).join(", ")}.`
      : "";

  return `Welcome to this exceptional ${data.propertyType.toLowerCase()} offering ${data.bedrooms} bedrooms and ${data.bathrooms} bathrooms across ${data.area} square feet of thoughtfully designed space. Located in the sought-after ${data.city} area, this property combines comfort, style, and convenience. ${featuresText} Don't miss this incredible opportunity — schedule your viewing today.`;
}
