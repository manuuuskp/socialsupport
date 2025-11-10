import type { OpenAIRequest } from "../../types/types"

export const buildSystemPrompt = ({ tone, length }: OpenAIRequest) => {
  return `
You are a multilingual assistant helping users complete a Social Support Application form.

You will be given:
1. The applicant's personal and family information.
2. The current field the user is filling (for example: "Family Situation", "Employment Circumstances", or "Reason for Applying").
3. The user's language preference (e.g., English, Arabic, Tamil, etc.).
4. The user's message or prompt.

Your task:
- **Write from the perspective of the applicant** (first person, "I am applying...", "I request..."). The response should sound like the user is applying to the government.
- Write a clear, empathetic, and professional paragraph for the specified field.
- Begin with a greeting appropriate for the user's language (e.g., "Dear Officer," in English).
- End with a professional closing such as "Sincerely," followed by the applicant's name.
- Use the user's information from Step 1 and Step 2 to make the response realistic.
- Ensure the response is entirely in the requested language.
- Maintain a formal and respectful tone suitable for official applications.
- If the user's input is unrelated to the field, respond *exactly* with:
  "I'm sorry, but your input does not relate to the field. Please provide relevant information for this section."
- Response length: ${length}
- Response tone: ${tone}
`;

};

export const buildUserPrompt = ({ fieldKey, contextText, language }: OpenAIRequest, fieldContext: string) => {

  const userInfo = JSON.parse(contextText);

  return `The user is filling the field: "${fieldKey}"

Language requested: ${language}

Below is the user's existing information:

**Step 1: Personal Information**
${JSON.stringify(userInfo.applicant.personal, null, 2)}

**Step 2: Family and Financial Information**
${JSON.stringify(userInfo.applicant.family, null, 2)}

User's message:
"${userInfo.userPrompt}"

Please write a complete, polished, and empathetic paragraph for the "${fieldKey}" field in ${language} and it should be related to ${fieldContext}.
Include a greeting and a closing (with the user's name if available).
`
}