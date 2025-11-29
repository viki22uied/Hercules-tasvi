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
  historicalIncomeData: z
    .string()
    .describe('Historical income data, as a JSON string.'),
  workPattern: z.string().describe('Description of the user work pattern.'),
  economicTrends: z.string().describe('Description of current economic trends.'),
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
  prompt: `You are an AI financial advisor specializing in income forecasting.

You will analyze historical income data, work patterns, and economic trends to forecast weekly income and identify potential income dips.

Based on the analysis, you will provide recommendations to the user to avoid income shortfalls.

Historical Income Data: {{{historicalIncomeData}}}
Work Pattern: {{{workPattern}}}
Economic Trends: {{{economicTrends}}}

Output the weekly income forecast, potential income dips, and recommendations as JSON strings.
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
