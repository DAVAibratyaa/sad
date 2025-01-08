import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface RecentReport {
  id: number
  examType: string
  createdAt: string
}

interface RecentReportsProps {
  reports: RecentReport[]
}

export function RecentReports({ reports }: RecentReportsProps) {
  return (
    <Card className="bg-vercel-darker border-vercel-dark shadow-xl rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <ul className="divide-y divide-vercel-dark">
          {reports.map((report) => (
            <li key={report.id} className="flex items-center justify-between p-4 hover:bg-vercel-dark transition-all duration-200">
              <span className="text-white text-sm truncate max-w-[200px]">{report.examType}</span>
              <span className="text-vercel-silver text-xs flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: ptBR })}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

