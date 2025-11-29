import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AppLogo } from '@/components/common/AppLogo';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <AppLogo className="size-8 text-primary" />
          <span className="text-lg font-bold text-foreground">
            Hercules Finance AI
          </span>
        </Link>
        <Button asChild>
          <Link href="/dashboard">
            Get Started <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="relative h-[60vh] min-h-[400px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="relative z-10 flex h-full items-center justify-center">
            <div className="container mx-auto px-4 text-center text-card-foreground">
              <div className="max-w-3xl mx-auto bg-background/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Your Intelligent Financial Companion
                </h1>
                <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                  Harness the power of AI to forecast income, manage cash flow,
                  and build a secure financial future with confidence.
                </p>
                <div className="mt-10">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      Take Control of Your Finances
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="text-center">
                <h3 className="font-headline text-2xl font-bold">
                  AI-Powered Forecasting
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Predict income dips and plan ahead with our intelligent
                  forecasting tools.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-headline text-2xl font-bold">
                  Personalized Plans
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Get custom crisis plans and culturally-aware investment advice.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-headline text-2xl font-bold">
                  Family &amp; Security
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Collaborate on family finances and learn to spot scams with our
                  simulations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hercules Finance AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
