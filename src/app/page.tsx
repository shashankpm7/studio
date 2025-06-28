import { Shield } from "lucide-react";
import ChainSentryClient from "@/components/chainsentry-client";
import TrendingNews from "@/components/trending-news";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold font-headline text-lg">ChainSentry</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container max-w-screen-lg mx-auto px-4 py-12 md:py-20">
          <div className="text-center">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Secure Your Smart Contracts
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl">
              ChainSentry leverages cutting-edge AI to scan Ethereum, Solana, and ETC smart contracts for vulnerabilities, providing detailed reports to keep your dApps secure.
            </p>
          </div>

          <ChainSentryClient />

          <TrendingNews />

        </div>
      </main>
    </div>
  );
}
