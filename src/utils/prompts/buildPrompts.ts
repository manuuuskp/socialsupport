import type { OpenAIRequest } from "../../types/types"

const situationInfo = {
  financialSituation: 'details about financial hardships, debts, or challenges.',
  employmentCircumstances: 'information about job loss, reduced hours, or inability to work.',
  reasonForApplying: 'details about the help needed and how it will benefit the user and their family.'
}

export const buildSystemPrompt = ({ tone, length, fieldKey, language }: OpenAIRequest) => {
    return `You are a helpful assistant that writes first-person, professional financial assistance applications. 
You will receive details about the applicant (like name, employment status, dependents, housing status, income, etc.) and must write as if the applicant themselves is submitting the request.

Instructions:
- Write the response **in the first person** (use “I”, not “he/she”).
- Do **not** include any labels such as “Short response” or “Medium response”.
- Always use the applicant's name (provided in the user message) when signing off or referring to the applicant.
- Maintain a respectful, humble, and professional tone suitable for a government or social support application.
- Only generate a statement if the user's input is relevant to "${fieldKey}" or related to "${situationInfo[fieldKey as keyof typeof situationInfo]}".
- If the input is irrelevant, respond politely with:
   "I'm sorry, but your input does not relate to the ${fieldKey} field. Please provide relevant information for this section."
- Length: 
   - short → 50-100 words
   - medium → 100-200 words
   - long → 200-300 words
- Focus on genuine need, family context, and financial hardship.
- Always mind the statement should be like the Applicant is applying. Always give a reply other than the input is irrelevant. 

Generate a ${tone} and ${length} application response for the field "${fieldKey}" in "${language}" language.
`
}

export const buildUserPrompt = ({ fieldKey, contextText, language, tone, length }: OpenAIRequest, fieldContext: string) => {
  return `Please generate a statement for the "${fieldKey}" section.
Ï
${fieldContext}

User-provided details:
${contextText}

Tone: ${tone}
Length: ${length}
Field: ${fieldKey}
language: ${language}`
}