import React from 'react';
import { SalesData } from '../types/sales';
import { Phone, PhoneOff } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Props {
  data: SalesData[];
}

export default function PhoneCallStats({ data }: Props) {
  const answeredCalls = data.reduce((sum, day) => sum + (day.phoneCallsAnswered || 0), 0);
  const missedCalls = data.reduce((sum, day) => sum + (day.missedPhoneCalls || 0), 0);
  const totalCalls = answeredCalls + missedCalls;
  const answerRate = totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0;
  const dailyAverage = totalCalls > 0 ? totalCalls / data.length : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phone Call Statistics</CardTitle>
        <CardDescription>Monthly call handling metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Answered Calls</p>
              <p className="text-xl font-semibold text-gray-900">{answeredCalls}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <PhoneOff className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Missed Calls</p>
              <p className="text-xl font-semibold text-gray-900">{missedCalls}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Answer Rate</span>
            <span>{answerRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${answerRate}%` }}
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Daily Average: <span className="font-medium text-gray-900">{dailyAverage.toFixed(1)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}