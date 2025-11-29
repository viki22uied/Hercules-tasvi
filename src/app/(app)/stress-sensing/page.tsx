import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StressSensingClient } from './components/StressSensingClient';

export default function StressSensingPage() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Emotional Stress Sensing</h1>
        <p className="text-muted-foreground">
          Detect potential financial distress through sentiment analysis of your thoughts or transaction details.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>
            Enter any text below, like a recent transaction or how you're feeling about your finances, to get an analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StressSensingClient />
        </CardContent>
      </Card>
    </div>
  );
}
