import OpenAI from "openai";

import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export interface ProductDescriptionInput {
  name: string;
  sku?: string;
  categoryName: string;
  requiresPrescription: boolean;
}

export async function createProductDescriptionStream(
  input: ProductDescriptionInput,
  signal: AbortSignal
) {
  if (!env.OPENAI_API_KEY) {
    throw new AppError(
      503,
      "OPENAI_NOT_CONFIGURED",
      "OpenAI is not configured on the server"
    );
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  return client.responses.create(
    {
      model: env.OPENAI_MODEL,
      instructions: [
        "You write concise veterinary inventory product descriptions in Spanish.",
        "Return only the final description as plain text, with no title, markdown, or quotation marks.",
        "Use a professional and understandable tone for veterinary clinic staff.",
        "Write one short paragraph of at most 120 words.",
        "Do not invent dosage, indications, contraindications, efficacy claims, or regulatory approvals.",
        "If the category requires a prescription, mention that veterinary authorization may be required."
      ].join(" "),
      input: [
        `Product name: ${input.name}`,
        `SKU: ${input.sku || "Not provided"}`,
        `Category: ${input.categoryName}`,
        `Requires prescription: ${input.requiresPrescription ? "yes" : "no"}`
      ].join("\n"),
      max_output_tokens: 220,
      stream: true
    },
    { signal }
  );
}
