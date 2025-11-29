import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IncomeIntelligenceClient } from './components/IncomeIntelligenceClient';

export default function IncomeIntelligencePage() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Income Intelligence &amp; Forecasting</h1>
        <p className="text-muted-foreground">
          Analyze historical income data to forecast weekly income and proactively identify potential income dips.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Income Analysis</CardTitle>
          <CardDescription>
            Provide your financial details to get an AI-powered income forecast.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IncomeIntelligenceClient />
        </CardContent>
      </Card>
    </div>
  );
}
