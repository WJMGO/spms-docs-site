import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUp, Plus, Save, X, Loader2 } from 'lucide-react';
import { trpc } from '@/trpc';
import { toast } from 'sonner';
interface PersonalGoal {
  id: string;
  type: 'KPI' | 'Task';
  description: string;
  krs?: string;
  targetDate?: string;
  status: 'completed' | 'in_progress' | 'pending';
  score: number;
}

interface WorkQualityMetric {
  id: string;
  name: string;
  value: number;
  description: string;
}

interface BonusItem {
  id: string;
  type: string;
  description: string;
  score: number;
}

interface PenaltyItem {
  id: string;
  type: string;
  description: string;
  score: number;
}

export default function PerformanceRegistration() {
  const [employeeId, setEmployeeId] = useState<string>('employee_1');
  const [periodId, setPeriodId] = useState<string>('');
  const [forecastScore, setForecastScore] = useState<number>(95.8);
  const [scoreChange, setScoreChange] = useState<number>(2.4);
  const [isLoading, setIsLoading] = useState(false);

  // 个人月度目标
  const [personalGoals, setPersonalGoals] = useState<PersonalGoal[]>([
    {
      id: '1',
      type: 'KPI',
      description: '云原生架构迁移',
      krs: '完成80%核心服务度发布',
      targetDate: '12-20',
      status: 'in_progress',
      score: 45.0,
    },
    {
      id: '2',
      type: 'Task',
      description: '安全审计优化',
      krs: '修复Top 10高危漏洞',
      targetDate: '12-15',
      status: 'in_progress',
      score: 30.0,
    },
  ]);

  // 工作质量数据
  const [workQualityMetrics, setWorkQualityMetrics] = useState<WorkQualityMetric[]>([
    {
      id: '1',
      name: '代码走查',
      value: 24,
      description: '代码走查次数',
    },
    {
      id: '2',
      name: '审计',
      value: 12,
      description: '代码审核通过',
    },
    {
      id: '3',
      name: 'Bug打回率',
      value: 3,
      description: 'Bug打回打回',
    },
    {
      id: '4',
      name: '设计',
      value: 8,
      description: '设计审查参与',
    },
  ]);

  // 绩效加分项
  const [bonusItems, setBonusItems] = useState<BonusItem[]>([
    {
      id: '1',
      type: '培养新人',
      description: '担任新人指导师，指导新人入职，并在月度使用期间进行指导',
      score: 5.0,
    },
    {
      id: '2',
      type: '技术分享',
      description: '主持《大数据安全架构》部门内技术分享，参与人数50+，评评率98%',
      score: 8.0,
    },
  ]);

  // 绩效扣分项
  const [penaltyItems, setPenaltyItems] = useState<PenaltyItem[]>([
    {
      id: '1',
      type: '技术失误',
      description: '无',
      score: -0.0,
    },
    {
      id: '2',
      type: '管理失误',
      description: '参与绩效登记（1次）',
      score: -0.5,
    },
    {
      id: '3',
      type: '质量异常',
      description: '无',
      score: -0.0,
    },
  ]);

  // 计算总分
  const totalScore = useMemo(() => {
    const goalsScore = personalGoals.reduce((sum, goal) => sum + goal.score, 0);
    const bonusScore = bonusItems.reduce((sum, item) => sum + item.score, 0);
    const penaltyScore = penaltyItems.reduce((sum, item) => sum + item.score, 0);
    return goalsScore + bonusScore + penaltyScore;
  }, [personalGoals, bonusItems, penaltyItems]);

  // 获取数据
  const { data: registrationData, isLoading: dataLoading } = (trpc.registration as any).getRegistration.useQuery(
    {
      employeeId: employeeId || '',
      periodId: periodId || '',
    },
    {
      enabled: !!employeeId && !!periodId,
    }
  );

  // 使用获取的数据
  useEffect(() => {
    if (registrationData?.data) {
      const data = registrationData.data;
      setForecastScore(data.forecastScore);
      setScoreChange(data.scoreChange);
      setPersonalGoals(data.personalGoals);
      setWorkQualityMetrics(data.workQualityMetrics);
      setBonusItems(data.bonusItems);
      setPenaltyItems(data.penaltyItems);
    }
  }, [registrationData]);

  // 保存 mutation
  const saveMutation = (trpc.registration as any).saveRegistration.useMutation();

  // 提交 mutation
  const submitMutation = (trpc.registration as any).submitRegistration.useMutation();

  // 处理保存
  const handleSave = async () => {
    try {
      setIsLoading(true);
      await saveMutation.mutateAsync({
        employeeId,
        periodId,
        forecastScore,
        scoreChange,
        personalGoals,
        workQualityMetrics,
        bonusItems,
        penaltyItems,
      });
      toast.success('数据保存成功');
    } catch (error: any) {
      toast.error(`保存失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理提交
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await submitMutation.mutateAsync({
        employeeId,
        periodId,
        data: {
          employeeId,
          periodId,
          forecastScore,
          scoreChange,
          personalGoals,
          workQualityMetrics,
          bonusItems,
          penaltyItems,
        },
      });
      toast.success('数据提交成功');
    } catch (error: any) {
      toast.error(`提交失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 mx-auto mb-4" />
          <p className="text-muted-foreground">加载数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">12月绩效登记</h1>
          <p className="text-muted-foreground mt-2">考核周期: 11月26日 - 12月25日</p>
        </div>

        {/* 顶部评分卡 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-gradient-to-br from-primary to-primary_dim text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-90">当前预测分分 (Forecast Score)</p>
                  <h2 className="text-5xl font-bold mt-2">{forecastScore}</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                  <ArrowUp size={16} />
                  <span className="text-sm font-medium">高于上月 {scoreChange}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <div className="flex flex-col gap-3">
            <Button onClick={handleSave} className="gap-2" variant="default">
              <Save size={16} />
              保存草稿
            </Button>
            <Button onClick={handleSubmit} className="gap-2" variant="default">
              提交管理层审查 →
            </Button>
          </div>
        </div>

        {/* 个人月度目标 */}
        <Card className="border-0 bg-surface-container-low">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>个人月度目标</CardTitle>
                <CardDescription>更新于 2小时前</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Plus size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-x-auto bg-surface-container-lowest">
              <Table>
                <TableHeader>
                  <TableRow className="bg-surface-container-high border-0">
                    <TableHead className="text-xs font-medium text-on-surface-variant">考核维度</TableHead>
                    <TableHead className="text-xs font-medium text-on-surface-variant">月度目标</TableHead>
                    <TableHead className="text-xs font-medium text-on-surface-variant">关键结果 (KRS)</TableHead>
                    <TableHead className="text-xs font-medium text-on-surface-variant">截止日期</TableHead>
                    <TableHead className="text-xs font-medium text-on-surface-variant">达成状态</TableHead>
                    <TableHead className="text-right text-xs font-medium text-on-surface-variant">直评分数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personalGoals.map((goal, idx) => (
                    <TableRow key={goal.id} className={idx % 2 === 0 ? 'bg-surface-container-low' : 'bg-surface-container-lowest'}>
                      <TableCell className="text-sm font-medium">{goal.type}</TableCell>
                      <TableCell className="text-sm">{goal.description}</TableCell>
                      <TableCell className="text-sm">{goal.krs}</TableCell>
                      <TableCell className="text-sm">{goal.targetDate}</TableCell>
                      <TableCell>
                        <Badge className="bg-tertiary-container text-on-tertiary-container rounded-full">
                          已达成
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold">{goal.score.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 工作质量数据 */}
        <Card className="border-0 bg-surface-container-low">
          <CardHeader>
            <CardTitle>工作质量数据</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {workQualityMetrics.map((metric) => (
                <div key={metric.id} className="bg-surface-container-lowest p-6 rounded-lg border-l-4 border-primary">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🔍</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface-variant">{metric.name}</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 绩效加分项 */}
        <Card className="border-0 bg-surface-container-low">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>绩效加分项</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  + 新增加分项
                </Button>
                <Button variant="outline" size="sm">
                  绩效扣分项
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bonusItems.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest p-6 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                        <span className="text-lg">👥</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.type}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-success">+{item.score.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 绩效扣分项 */}
        <Card className="border-0 bg-surface-container-low">
          <CardHeader>
            <CardTitle>绩效扣分项</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {penaltyItems.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest p-6 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">{item.type}</p>
                    </div>
                    <span className={`text-lg font-bold ${item.score < 0 ? 'text-error' : 'text-foreground'}`}>
                      {item.score.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 总分显示 */}
        <Card className="border-0 bg-primary text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">最终评分</p>
                <p className="text-4xl font-bold mt-2">{totalScore.toFixed(1)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">资料完整度: 75%</p>
                <div className="w-32 h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 底部操作 */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline">取消修改</Button>
          <Button onClick={handleSubmit} className="gap-2">
            提交并送管理层 →
          </Button>
        </div>
      </div>
    </div>
  );
}
