'use server';

/**
 * @fileOverview Fetches trending news in the cryptocurrency space.
 *
 * - getTrendingCryptoNews - A function that returns a list of trending crypto news articles.
 * - GetTrendingCryptoNewsOutput - The return type for the getTrendingCryptoNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NewsArticleSchema = z.object({
  title: z.string().describe('The headline of the news article.'),
  summary: z.string().describe('A brief summary of the news article.'),
  source: z.string().describe('The source of the news article (e.g., CoinDesk).'),
  url: z.string().describe('The URL to the full news article.'),
  sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe('The overall sentiment of the article regarding the crypto market.'),
  imageUrl: z.string().describe('A URL for an image related to the article.'),
});

const GetTrendingCryptoNewsOutputSchema = z.object({
  articles: z.array(NewsArticleSchema).describe('A list of trending cryptocurrency news articles.'),
});

export type GetTrendingCryptoNewsOutput = z.infer<typeof GetTrendingCryptoNewsOutputSchema>;

export async function getTrendingCryptoNews(): Promise<GetTrendingCryptoNewsOutput> {
  return getTrendingCryptoNewsFlow();
}

const getTrendingCryptoNewsPrompt = ai.definePrompt({
  name: 'getTrendingCryptoNewsPrompt',
  output: {schema: GetTrendingCryptoNewsOutputSchema},
  prompt: `You are a cryptocurrency market analyst. Your task is to provide a list of the top 5 most trending and impactful news articles in the cryptocurrency space right now.

For each article, provide the following details:
- title: The headline of the news article.
- summary: A one or two-sentence summary of the key points.
- source: The name of the news publication (e.g., CoinDesk, Decrypt, The Block).
- url: The direct URL to the article.
- sentiment: The overall sentiment of the article, which must be one of 'Positive', 'Negative', or 'Neutral'.
- imageUrl: A relevant image URL for the article. Use a placeholder image from https://placehold.co/ with a size like 600x400 if a real one isn't available.

Return the list of articles in JSON format.`,
});

const getTrendingCryptoNewsFlow = ai.defineFlow(
  {
    name: 'getTrendingCryptoNewsFlow',
    outputSchema: GetTrendingCryptoNewsOutputSchema,
  },
  async () => {
    const {output} = await getTrendingCryptoNewsPrompt({});
    return output!;
  }
);
