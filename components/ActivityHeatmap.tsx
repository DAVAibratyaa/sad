import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from 'lucide-react'
import { format, parseISO, eachDayOfInterval, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
}

const colorScale = [
  'bg-gray-900',   // 0
  'bg-blue-900',   // 1-2
  'bg-blue-700',   // 3-5
  'bg-blue-500',   // 6-10
  'bg-blue-300',   // 11+
];

const getColor = (count: number): string => {
  if (count === 0) return colorScale[0];
  if (count < 3) return colorScale[1];
  if (count < 6) return colorScale[2];
  if (count < 11) return colorScale[3];
  return colorScale[4];
};

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const today = new Date();
  const startDate = subDays(today, 364);
  const dateRange = eachDayOfInterval({ start: startDate, end: today });

  const activityMap = new Map(data.map(item => [item.date, item.count]));

  const weeks = [];
  for (let i = 0; i < 52; i++) {
    const week = dateRange.slice(i * 7, (i + 1) * 7);
    weeks.push(week);
  }

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-blue-500" />
          Atividade Global
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((day, dayIndex) => {
                const dateString = format(day, 'yyyy-MM-dd');
                const count = activityMap.get(dateString) || 0;
                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getColor(count)}`}
                    title={`${format(day, 'dd MMM yyyy', { locale: ptBR })}: ${count} relatório${count !== 1 ? 's' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-400">
          <span>{format(startDate, 'MMM yyyy', { locale: ptBR })}</span>
          <span>{format(today, 'MMM yyyy', { locale: ptBR })}</span>
        </div>
      </CardContent>
    </Card>
  );
}

