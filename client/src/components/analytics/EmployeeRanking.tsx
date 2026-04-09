import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Download,
  Eye,
  Trophy,
  Medal,
  Award,
  MoreHorizontal,
  TrendingUp,
  Users,
  Building
} from "lucide-react";

interface EmployeeRankingProps {
  employeeRanking: any;
  isLoading: boolean;
}

// Mock data for development
const mockEmployeeRanking = [
  {
    id: "001",
    name: "张三",
    department: "技术部",
    position: "高级工程师",
    totalScore: 96.5,
    workQuality: 95,
    personalGoals: 94,
    departmentCollaboration: 98,
    innovation: 92,
    skillImprovement: 94,
    responsibility: 97,
    rank: 1,
    trend: "up",
    assessments: 4
  },
  {
    id: "002",
    name: "李四",
    department: "销售部",
    position: "销售经理",
    totalScore: 94.8,
    workQuality: 92,
    personalGoals: 96,
    departmentCollaboration: 90,
    innovation: 91,
    skillImprovement: 93,
    responsibility: 98,
    rank: 2,
    trend: "up",
    assessments: 4
  },
  {
    id: "003",
    name: "王五",
    department: "技术部",
    position: "技术总监",
    totalScore: 93.2,
    workQuality: 94,
    personalGoals: 92,
    departmentCollaboration: 91,
    innovation: 93,
    skillImprovement: 92,
    responsibility: 94,
    rank: 3,
    trend: "stable",
    assessments: 4
  },
  {
    id: "004",
    name: "赵六",
    department: "市场部",
    position: "市场专员",
    totalScore: 91.5,
    workQuality: 90,
    personalGoals: 89,
    departmentCollaboration: 92,
    innovation: 88,
    skillImprovement: 90,
    responsibility: 93,
    rank: 4,
    trend: "down",
    assessments: 3
  },
  {
    id: "005",
    name: "孙七",
    department: "人力资源部",
    position: "HR主管",
    totalScore: 90.8,
    workQuality: 89,
    personalGoals: 91,
    departmentCollaboration: 93,
    innovation: 87,
    skillImprovement: 89,
    responsibility: 91,
    rank: 5,
    trend: "up",
    assessments: 4
  },
  {
    id: "006",
    name: "周八",
    department: "财务部",
    position: "财务经理",
    totalScore: 89.2,
    workQuality: 88,
    personalGoals: 87,
    departmentCollaboration: 90,
    innovation: 85,
    skillImprovement: 88,
    responsibility: 92,
    rank: 6,
    trend: "stable",
    assessments: 4
  }
];

interface RankingRowProps {
  employee: any;
  index: number;
}

function RankingRow({ employee, index }: RankingRowProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-lg font-bold">#{rank}</span>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-600 transform rotate-180" />;
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <TableRow>
      <TableCell className="w-12">
        {getRankIcon(employee.rank)}
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{employee.name}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Building className="h-3 w-3" />
            {employee.department} • {employee.position}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-right">
          <div className="font-bold text-lg">{employee.totalScore}</div>
          <div className="text-sm text-muted-foreground">总分</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>工作质量</span>
            <span>{employee.workQuality}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>个人目标</span>
            <span>{employee.personalGoals}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>部门协作</span>
            <span>{employee.departmentCollaboration}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>创新改进</span>
            <span>{employee.innovation}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>能力提升</span>
            <span>{employee.skillImprovement}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>责任担当</span>
            <span>{employee.responsibility}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          {getTrendIcon(employee.trend)}
          <span className="text-sm">
            {employee.trend === "up" ? "上升" : employee.trend === "down" ? "下降" : "稳定"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="outline">{employee.assessments} 次</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              导出数据
            </DropdownMenuItem>
            <DropdownMenuItem>
              对比分析
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function EmployeeRanking({ employeeRanking, isLoading }: EmployeeRankingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"totalScore" | "department" | "rank">("totalScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Use mock data for development
  const data = isLoading ? [] : mockEmployeeRanking;

  const filteredData = data
    .filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "totalScore") {
        return sortOrder === "desc" ? b.totalScore - a.totalScore : a.totalScore - b.totalScore;
      } else if (sortBy === "department") {
        return sortOrder === "desc"
          ? b.department.localeCompare(a.department)
          : a.department.localeCompare(b.department);
      } else {
        return sortOrder === "desc" ? b.rank - a.rank : a.rank - b.rank;
      }
    });

  const departmentStats = data.reduce((acc, employee) => {
    if (!acc[employee.department]) {
      acc[employee.department] = { count: 0, avgScore: 0, totalScore: 0 };
    }
    acc[employee.department].count++;
    acc[employee.department].totalScore += employee.totalScore;
    acc[employee.department].avgScore = acc[employee.department].totalScore / acc[employee.department].count;
    return acc;
  }, {} as any);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>加载员工排名数据...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 部门统计概览 */}
      <Card>
        <CardHeader>
          <CardTitle>部门排名统计</CardTitle>
          <CardDescription>各部门平均得分及人数分布</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(departmentStats).map(([dept, stats]: [string, any]) => (
              <div key={dept} className="border rounded-lg p-4">
                <div className="font-medium mb-2">{dept}</div>
                <div className="text-2xl font-bold">{stats.avgScore.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">平均得分</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.count} 名员工
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 排名列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>员工绩效排名</CardTitle>
              <CardDescription>
                基于六维度综合评分的员工排名
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出排名
              </Button>
            </div>
          </div>

          {/* 搜索和筛选 */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索员工姓名或部门..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="totalScore">按总分排序</SelectItem>
                <SelectItem value="department">按部门排序</SelectItem>
                <SelectItem value="rank">按名次排序</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>员工信息</TableHead>
                  <TableHead className="text-right">总分</TableHead>
                  <TableHead>核心维度</TableHead>
                  <TableHead>发展维度</TableHead>
                  <TableHead className="text-center">趋势</TableHead>
                  <TableHead className="text-center">评估次数</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((employee, index) => (
                  <RankingRow
                    key={employee.id}
                    employee={employee}
                    index={index}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            显示 {filteredData.length} / {data.length} 名员工
          </div>
        </CardContent>
      </Card>

      {/* TOP 3 特殊展示 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.slice(0, 3).map((employee, index) => (
          <Card key={employee.id} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-transparent opacity-20 w-32 h-32 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {index === 0 && <Trophy className="h-6 w-6 text-yellow-500" />}
                  {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                  {index === 2 && <Award className="h-6 w-6 text-amber-600" />}
                  <span className="text-2xl font-bold">
                    #{employee.rank}
                  </span>
                </div>
                <Badge variant={index === 0 ? "default" : "secondary"}>
                  {employee.department}
                </Badge>
              </div>
              <CardTitle className="text-xl">{employee.name}</CardTitle>
              <CardDescription>{employee.position}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>总分</span>
                  <span className="font-bold text-lg">{employee.totalScore}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>最高维度</span>
                    <span className="font-medium text-green-600">
                      {employee.departmentCollaboration} (部门协作)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>待提升</span>
                    <span className="font-medium text-orange-600">
                      {employee.innovation} (创新改进)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}