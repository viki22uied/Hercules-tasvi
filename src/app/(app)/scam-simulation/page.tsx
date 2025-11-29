import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScamSimulationClient } from './components/ScamSimulationClient';

export default function ScamSimulationPage() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Scam &amp; Fraud Simulation</h1>
        <p className="text-muted-foreground">
          Learn to identify fraudulent activities by experiencing realistic, AI-powered scam simulations.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Scam Simulator</CardTitle>
          <CardDescription>
            Choose a scam type to start the simulation and test your awareness.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScamSimulationClient />
        </CardContent>
      </Card>
    </div>
  );
}
