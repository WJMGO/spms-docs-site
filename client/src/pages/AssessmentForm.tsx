import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Send, AlertCircle } from 'lucide-react';

/**
 * 绩效评分表单页面
 * 允许员工填写绩效评分表单并提交
 */
export default function AssessmentForm({ assessmentId }: { assessmentId?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // 表单状态
  const [formData, setFormData] = useState({
    employeeId: '',
    periodId: '',
    templateId: '',
    scores: {} as Record<string, number>,
    comments: '',
  });

  // 模拟数据
  const employees = [
    { id: 'emp-1', name: '张三' },
    { id: 'emp-2', name: '李四' },
    { id: 'emp-3', name: '王五' },
  ];

  const periods = [
    { id: 'period-1', name: '2026年1月' },
    { id: 'period-2', name: '2026年2月' },
    { id: 'period-3', name: '2026年3月' },
  ];

  const templates = [
    { id: 'template-1', name: '标准绩效评分模板' },
    { id: 'template-2', name: '技术岗位评分模板' },
  ];

  // 评分项
  const assessmentItems = [
    { id: 'item-1', name: '工作完成度', weight: 30, description: '按时完成工作任务的程度' },
    { id: 'item-2', name: '工作质量', weight: 25, description: '工作成果的质量和准确性' },
    { id: 'item-3', name: '团队协作', weight: 20, description: '与团队成员的协作能力' },
    { id: 'item-4', name: '创新能力', weight: 15, description: '提出改进建议和创新想法' },
    { id: 'item-5', name: '专业素养', weight: 10, description: '职业素养和专业技能' },
  ];

  // 处理输入变化
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 处理评分项变化
  const handleScoreChange = (itemId: string, score: number) => {
    setFormData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [itemId]: score,
      },
    }));
  };

  // 计算总分
  const calculateTotalScore = () => {
    let totalScore = 0;
    let totalWeight = 0;

    assessmentItems.forEach((item) => {
      const score = formData.scores[item.id] || 0;
      totalScore += score * item.weight;
      totalWeight += item.weight;
    });

    return totalWeight > 0 ? (totalScore / totalWeight).toFixed(2) : '0.00';
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('草稿已保存');
    } finally {
      setIsSaving(false);
    }
  };

  // 提交评分
  const handleSubmit = async () => {
    if (!formData.employeeId || !formData.periodId || !formData.templateId) {
      alert('请填写所有必填项');
      return;
    }

    setIsLoading(true);
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('评分已提交');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {assessmentId ? '编辑绩效评分' : '新建绩效评分'}
        </h1>
        <p className="text-muted-foreground mt-2">填写员工的绩效评分表单</p>
      </div>

      {/* 提示信息 */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          请根据员工在评分周期内的表现，对各项指标进行客观评分。所有字段都是必填的。
        </AlertDescription>
      </Alert>

      {/* 表单 */}
      <Card>
        <CardHeader>
          <CardTitle>评分信息</CardTitle>
          <CardDescription>基本信息和评分项</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="scores">评分项</TabsTrigger>
              <TabsTrigger value="summary">总结</TabsTrigger>
            </TabsList>

            {/* 基本信息标签页 */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 员工选择 */}
                <div className="space-y-2">
                  <Label htmlFor="employee">
                    员工 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.employeeId} onValueChange={(value) => handleInputChange('employeeId', value)}>
                    <SelectTrigger id="employee">
                      <SelectValue placeholder="选择员工" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 评分周期 */}
                <div className="space-y-2">
                  <Label htmlFor="period">
                    评分周期 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.periodId} onValueChange={(value) => handleInputChange('periodId', value)}>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="选择评分周期" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 评分模板 */}
                <div className="space-y-2">
                  <Label htmlFor="template">
                    评分模板 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.templateId} onValueChange={(value) => handleInputChange('templateId', value)}>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="选择评分模板" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* 评分项标签页 */}
            <TabsContent value="scores" className="space-y-6">
              {assessmentItems.map((item) => (
                <div key={item.id} className="space-y-3 pb-6 border-b last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">{item.name}</Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{formData.scores[item.id] || 0}</p>
                      <p className="text-xs text-muted-foreground">权重: {item.weight}%</p>
                    </div>
                  </div>

                  {/* 滑块 */}
                  <Slider
                    value={[formData.scores[item.id] || 0]}
                    onValueChange={(value) => handleScoreChange(item.id, value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />

                  {/* 分数范围提示 */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 分</span>
                    <span>50 分</span>
                    <span>100 分</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* 总结标签页 */}
            <TabsContent value="summary" className="space-y-6">
              {/* 总分显示 */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 space-y-2">
                <p className="text-sm text-muted-foreground">加权总分</p>
                <p className="text-4xl font-bold text-primary">{calculateTotalScore()}</p>
                <p className="text-sm text-muted-foreground">基于各项评分和权重自动计算</p>
              </div>

              {/* 评分分布 */}
              <div className="space-y-3">
                <Label>评分分布</Label>
                <div className="space-y-2">
                  {assessmentItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <span className="text-sm w-20">{item.name}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(formData.scores[item.id] || 0) / 100 * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{formData.scores[item.id] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <Label htmlFor="comments">备注</Label>
                <Textarea
                  id="comments"
                  placeholder="输入任何额外的评价或备注..."
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              保存草稿
            </>
          )}
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              提交中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              提交评分
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
