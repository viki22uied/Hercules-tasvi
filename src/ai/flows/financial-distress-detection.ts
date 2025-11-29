'use server';
/**
 * @fileOverview Detects potential financial distress via sentiment analysis on user input and transaction descriptions.
 *
 * - detectFinancialDistress - A function that handles the financial distress detection process.
 * - FinancialDistressInput - The input type for the detectFinancialDistress function.
 * - FinancialDistressOutput - The return type for the detectFinancialDistress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialDistressInputSchema = z.object({
  text: z.string().describe('User input text or transaction description.'),
});
export type FinancialDistressInput = z.infer<typeof FinancialDistressInputSchema>;

const FinancialDistressOutputSchema = z.object({
  isDistressed: z.boolean().describe('Whether the user is likely experiencing financial distress.'),
  sentimentScore: z.number().describe('The sentiment score of the input text, ranging from -1 (negative) to 1 (positive).'),
  reason: z.string().describe('The reason for the distress detection, based on the sentiment analysis.'),
});
export type FinancialDistressOutput = z.infer<typeof FinancialDistressOutputSchema>;

export async function detectFinancialDistress(input: FinancialDistressInput): Promise<FinancialDistressOutput> {
  return detectFinancialDistressFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialDistressPrompt',
  input: {schema: FinancialDistressInputSchema},
  output: {schema: FinancialDistressOutputSchema},
  prompt: `You are a financial distress detection AI.

You will analyze the sentiment of the input text to determine if the user is likely experiencing financial distress.

Based on the sentiment analysis, you will set the isDistressed output field appropriately.

Input Text: {{{text}}}

Respond in JSON format.
`,
});

const detectFinancialDistressFlow = ai.defineFlow(
  {
    name: 'detectFinancialDistressFlow',
    inputSchema: FinancialDistressInputSchema,
    outputSchema: FinancialDistressOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
