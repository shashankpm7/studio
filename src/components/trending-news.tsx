import { getTrendingCryptoNews } from '@/ai/flows/get-trending-crypto-news';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const SentimentIcon = ({ sentiment }: { sentiment: 'Positive' | 'Negative' | 'Neutral' }) => {
  switch (sentiment) {
    case 'Positive':
      return <ArrowUpRight className="h-4 w-4 text-chart-2" />;
    case 'Negative':
      return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    case 'Neutral':
      return <Minus className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
};

export default async function TrendingNews() {
  let newsData;
  try {
    newsData = await getTrendingCryptoNews();
  } catch (error) {
    console.error("Failed to fetch trending news:", error);
    return null;
  }

  if (!newsData || !newsData.articles || newsData.articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 md:mt-20">
      <h2 className="font-headline text-3xl font-bold tracking-tighter mb-8 flex items-center gap-2">
        <TrendingUp className="h-8 w-8 text-primary" />
        Trending Crypto News
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsData.articles.slice(0, 3).map((article, index) => (
          <Card key={index} className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 bg-card/50 border-border/50 shadow-lg">
            <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block">
              <div className="relative w-full h-48">
                <Image
                  src={article.imageUrl || 'https://placehold.co/600x400.png'}
                  alt={article.title}
                  fill
                  className="object-cover"
                  data-ai-hint="crypto news"
                />
              </div>
            </Link>
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                 <CardTitle className="text-lg font-semibold leading-tight">
                    <Link href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {article.title}
                    </Link>
                 </CardTitle>
                 <Badge variant={
                    article.sentiment === 'Positive' ? 'outline'
                    : article.sentiment === 'Negative' ? 'destructive'
                    : 'secondary'
                 } className="flex-shrink-0 capitalize flex items-center gap-1 whitespace-nowrap">
                   <SentimentIcon sentiment={article.sentiment} />
                   {article.sentiment}
                 </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-6">
              <p className="text-sm text-muted-foreground mb-4 flex-grow">{article.summary}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto pt-4 border-t border-border/20">
                <span>Source: {article.source}</span>
                <Link href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                  Read More <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
