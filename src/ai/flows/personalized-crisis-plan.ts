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
  income: z.number().describe("The user's monthly income."),
  expenses: z.number().describe("The user's monthly expenses."),
  savings: z.number().describe("The user's total savings."),
  shortfallAmount: z.number().describe('The amount of the financial shortfall.'),
  location: z.string().describe("The user's current location (city, state)."),
  recentTransactions: z.string().describe("A list of user's most recent transactions."),
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
  prompt: `You are a financial advisor creating a concise, personalized plan to help a user manage a financial shortfall. Be reassuring and direct.

  Analyze the user's financial situation:
  - Income: {{income}}
  - Expenses: {{expenses}}
  - Savings: {{savings}}
  - Shortfall Amount: {{shortfallAmount}}
  - Location: {{location}}
  - Recent Transactions: {{recentTransactions}}

  Generate a brief, scannable plan using Markdown. Use headings (e.g., '### Step 1'), bullet points (*), and bold text.
  The plan should be short and to the point.
  1.  Actionable steps to optimize expenses.
  2.  Optional steps for income enhancement.
  3.  A recommendation for budgeting.

  For 'suggestedResources', provide a short bulleted list of real resources in their location.

  Make the entire output calm, concise, and easy to read.
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
