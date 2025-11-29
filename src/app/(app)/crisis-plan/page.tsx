import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CrisisPlanClient } from './components/CrisisPlanClient';

export default function CrisisPlanPage() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Personalized Crisis Response</h1>
        <p className="text-muted-foreground">
          Generate a custom, actionable plan to manage a financial shortfall without causing panic.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Crisis Plan Generator</CardTitle>
          <CardDescription>
            Provide your financial details to receive a step-by-step plan to navigate your financial shortfall.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrisisPlanClient />
        </CardContent>
      </Card>
    </div>
  );
}
