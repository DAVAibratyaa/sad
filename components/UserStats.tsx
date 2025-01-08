import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@/lib/types"

interface UserStatsProps {
  user: User;
}

export function UserStats({ user }: UserStatsProps) {
  return (
    <Card className="bg-[#1E1E1E] border-[#2E2E2E]">
      <CardHeader>
        <CardTitle className="text-white">Suas Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">{user.points}</span>
            <span className="text-sm text-gray-400">Pontos</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">{user.reportsGenerated}</span>
            <span className="text-sm text-gray-400">Relatórios</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">
              {(user.points / user.reportsGenerated).toFixed(1)}
            </span>
            <span className="text-sm text-gray-400">Média</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

