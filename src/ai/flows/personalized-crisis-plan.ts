'use server';

/**
 * @fileOverview A flow for generating personalized crisis plans.
 *
 * - generateCrisisPlan - A function that generates a personalized crisis plan.
 * - CrisisPlanInput - The input type for the generateCrisisPlan function.
 * - CrisisPlanOutput - The return type for the generateCrisisPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrisisPlanInputSchema = z.object({
  income: z.number().describe('The user\'s monthly income.'),
  expenses: z.number().describe('The user\'s monthly expenses.'),
  savings: z.number().describe('The user\'s total savings.'),
  shortfallAmount: z.number().describe('The amount of the financial shortfall.'),
  location: z.string().describe('The user\'s current location (city, state).'),
  recentTransactions: z.string().describe('A list of user\'s most recent transactions.'),
});
export type CrisisPlanInput = z.infer<typeof CrisisPlanInputSchema>;

const CrisisPlanOutputSchema = z.object({
  plan: z.string().describe('A detailed plan to manage the financial shortfall, including expense optimization and resource identification.'),
  estimatedDuration: z.string().describe('The estimated duration to overcome the financial shortfall.'),
  suggestedResources: z.string().describe('A list of resources based on the user location that may help mitigate financial shortfall.'),
});
export type CrisisPlanOutput = z.infer<typeof CrisisPlanOutputSchema>;

export async function generateCrisisPlan(input: CrisisPlanInput): Promise<CrisisPlanOutput> {
  return generateCrisisPlanFlow(input);
}

const crisisPlanPrompt = ai.definePrompt({
  name: 'crisisPlanPrompt',
  input: {schema: CrisisPlanInputSchema},
  output: {schema: CrisisPlanOutputSchema},
  prompt: `You are a financial advisor tasked with creating personalized plans to help users manage financial shortfalls without causing panic or anxiety.

  Analyze the user's financial situation based on the following information:
  - Income: {{income}}
  - Expenses: {{expenses}}
  - Savings: {{savings}}
  - Shortfall Amount: {{shortfallAmount}}
  - Location: {{location}}
  - Recent Transactions: {{recentTransactions}}

  Based on this information, create a detailed plan that is clear, reassuring, and easy to read.

  For the 'plan' output, use Markdown formatting. Use headings (like '### Step 1: Immediate Action'), bullet points (*), and bold text to make it easy to scan.
  The plan should include:
  1. Specific and actionable steps to optimize expenses.
  2. Optional but recommended steps for income enhancement.
  3. A recommendation for budgeting and tracking.

  For the 'suggestedResources' output, use Markdown formatting with bullet points. Identify available resources in their location to mitigate the shortfall. Do not make up any resources; use only existing programs or services.

  Make sure the plan is realistic and achievable, and present it in a calm, encouraging tone.
`,
});

const generateCrisisPlanFlow = ai.defineFlow(
  {
    name: 'generateCrisisPlanFlow',
    inputSchema: CrisisPlanInputSchema,
    outputSchema: CrisisPlanOutputSchema,
  },
  async input => {
    const {output} = await crisisPlanPrompt(input);
    return output!;
  }
);
