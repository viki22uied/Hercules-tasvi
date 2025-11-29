'use server';
/**
 * @fileOverview Simulates fake calls and scams to enhance user awareness and protection against financial fraud.
 *
 * - simulateScam - A function that simulates a scam scenario.
 * - SimulateScamInput - The input type for the simulateScam function.
 * - SimulateScamOutput - The return type for the simulateScam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateScamInputSchema = z.object({
  scamType: z
    .string()
    .describe(
      'The type of scam to simulate, e.g., phishing email, fake phone call, investment scam.'
    ),
  userDetails: z
    .string()
    .describe(
      'Details about the user to personalize the scam simulation, such as name, location, and financial situation.'
    ),
});
export type SimulateScamInput = z.infer<typeof SimulateScamInputSchema>;

const SimulateScamOutputSchema = z.object({
  simulationText: z
    .string()
    .describe('The text of the scam simulation, e.g., the phishing email or phone call script.'),
  explanation: z
    .string()
    .describe(
      'An explanation of the scam, including red flags and how to avoid it in the future.'
    ),
});
export type SimulateScamOutput = z.infer<typeof SimulateScamOutputSchema>;

export async function simulateScam(input: SimulateScamInput): Promise<SimulateScamOutput> {
  return simulateScamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateScamPrompt',
  input: {schema: SimulateScamInputSchema},
  output: {schema: SimulateScamOutputSchema},
  prompt: `You are an AI scam simulator.  You will simulate a specific type of scam based on user input.

  Scam Type: {{{scamType}}}
  User Details: {{{userDetails}}}

  Create a realistic simulation of the scam. After the simulation, explain the red flags and how to avoid this scam in the future.
  `,
});

const simulateScamFlow = ai.defineFlow(
  {
    name: 'simulateScamFlow',
    inputSchema: SimulateScamInputSchema,
    outputSchema: SimulateScamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
