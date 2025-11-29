'use server';

/**
 * @fileOverview Provides personalized investment guidance and educational content that considers the user's cultural background,
 * especially during traditional festivals, explaining investment opportunities in a relevant, familiar context.
 *
 * - culturalInvestmentGuidance - A function that generates personalized investment guidance based on cultural background and festival context.
 * - CulturalInvestmentGuidanceInput - The input type for the culturalInvestmentGuidance function.
 * - CulturalInvestmentGuidanceOutput - The return type for the culturalInvestmentGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CulturalInvestmentGuidanceInputSchema = z.object({
  culturalBackground: z
    .string()
    .describe('The cultural background of the user.'),
  festival: z
    .string()
    .describe('The traditional festival for which investment guidance is requested (e.g., Diwali).'),
  location: z
    .string()
    .describe('The location of the user (e.g., Delhi, Mumbai, Chennai, Kolkata, Bangalore, and Hyderabad)'),
  investmentAmount: z
    .number()
    .describe('The amount user wants to invest.'),
});
export type CulturalInvestmentGuidanceInput = z.infer<
  typeof CulturalInvestmentGuidanceInputSchema
>;

const CulturalInvestmentGuidanceOutputSchema = z.object({
  guidance: z.string().describe('Personalized investment guidance considering the user\'s cultural background and the festival context.'),
});
export type CulturalInvestmentGuidanceOutput = z.infer<
  typeof CulturalInvestmentGuidanceOutputSchema
>;

export async function culturalInvestmentGuidance(
  input: CulturalInvestmentGuidanceInput
): Promise<CulturalInvestmentGuidanceOutput> {
  return culturalInvestmentGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'culturalInvestmentGuidancePrompt',
  input: {schema: CulturalInvestmentGuidanceInputSchema},
  output: {schema: CulturalInvestmentGuidanceOutputSchema},
  prompt: `You are an expert financial advisor specializing in culturally relevant investment strategies, especially during traditional festivals.

  Provide personalized investment guidance that considers the user\'s cultural background, the specific festival, their location and amount they want to invest.

  Cultural Background: {{{culturalBackground}}}
  Festival: {{{festival}}}
  Location: {{{location}}}
  Investment Amount: {{{investmentAmount}}}

  Explain investment opportunities in a relevant, familiar context, so the user can make informed investment decisions that align with their values.
  Focus on providing safe and reliable advice and avoid high risk investments.`,
});

const culturalInvestmentGuidanceFlow = ai.defineFlow(
  {
    name: 'culturalInvestmentGuidanceFlow',
    inputSchema: CulturalInvestmentGuidanceInputSchema,
    outputSchema: CulturalInvestmentGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
