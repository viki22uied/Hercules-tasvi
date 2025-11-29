'use server';

/**
 * @fileOverview Analyzes historical income data and forecasts weekly income, proactively identifying potential income dips.
 *
 * - predictIncomeDip - A function that handles the income dip prediction process.
 * - PredictIncomeDipInput - The input type for the predictIncomeDip function.
 * - PredictIncomeDipOutput - The return type for the predictIncomeDip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictIncomeDipInputSchema = z.object({
  userInput: z
    .string()
    .describe('A user\'s description of their income, work patterns, and any economic factors affecting them.'),
});
export type PredictIncomeDipInput = z.infer<typeof PredictIncomeDipInputSchema>;

const PredictIncomeDipOutputSchema = z.object({
  weeklyIncomeForecast: z
    .string()
    .describe('Forecast of weekly income, as a JSON string.'),
  potentialIncomeDips: z
    .string()
    .describe('Identification of potential income dips, as a JSON string.'),
  recommendations: z
    .string()
    .describe('Recommendations to avoid income shortfalls.'),
});
export type PredictIncomeDipOutput = z.infer<typeof PredictIncomeDipOutputSchema>;

export async function predictIncomeDip(input: PredictIncomeDipInput): Promise<PredictIncomeDipOutput> {
  return predictIncomeDipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictIncomeDipPrompt',
  input: {schema: PredictIncomeDipInputSchema},
  output: {schema: PredictIncomeDipOutputSchema},
  prompt: `You are an AI financial advisor specializing in income forecasting for gig workers.

  Analyze the user's freeform text input to understand their financial situation. Extract their historical income data, work patterns, and any relevant economic trends they mention.

  Based on the analysis, forecast their weekly income, identify potential income dips, and provide actionable recommendations to avoid income shortfalls.

  User Input: {{{userInput}}}

  Output the weekly income forecast and potential income dips as JSON strings. Provide the recommendations as a clear, easy-to-understand text.
`,
});

const predictIncomeDipFlow = ai.defineFlow(
  {
    name: 'predictIncomeDipFlow',
    inputSchema: PredictIncomeDipInputSchema,
    outputSchema: PredictIncomeDipOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
