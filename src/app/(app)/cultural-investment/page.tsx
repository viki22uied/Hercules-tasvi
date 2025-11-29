import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CulturalInvestmentClient } from './components/CulturalInvestmentClient';

export default function CulturalInvestmentPage() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Cultural Investment Education</h1>
        <p className="text-muted-foreground">
          Receive personalized investment guidance that considers your cultural background and traditional festivals.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Investment Guidance</CardTitle>
          <CardDescription>
            Tell us about your context to receive culturally relevant investment advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CulturalInvestmentClient />
        </CardContent>
      </Card>
    </div>
  );
}
