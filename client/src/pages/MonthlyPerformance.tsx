import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

export default function MonthlyPerformance() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock 当月绩效数据
  const monthlyData = {
    month: '2024年4月',
    totalEmployees: 1248,
    averageScore: 92.4,
    completionRate: 98.2,
    topPerformers: [
      { rank: 1, name: '张秋实', department: '研究中心', score: 98.5, completion: '100%' },
      { rank: 2, name: '李明', department: '产品部', score: 97.2, completion: '98%' },
      { rank: 3, name: '王芳', department: '设计部', score: 96.8, completion: '97%' },
      { rank: 4, name: '刘强', department: '技术部', score: 96.1, completion: '96%' },
      { rank: 5, name: '陈丽', department: '运营部', score: 95.9, completion: '95%' },
    ],
    departmentStats: [
      { name: '研究中心', score: 94.2, employees: 156 },
      { name: '产品部', score: 92.8, employees: 203 },
      { name: '设计部', score: 91.5, employees: 187 },
      { name: '技术部', score: 93.1, employees: 298 },
      { name: '运营部', score: 90.2, employees: 404 },
    ],
    scoreDistribution: [
      { range: '90-100', count: 856, percentage: 68.5 },
      { range: '80-89', count: 312, percentage: 25.0 },
      { range: '70-79', count: 68, percentage: 5.4 },
      { range: '<70', count: 12, percentage: 1.0 },
    ],
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">当月绩效评定</h1>
        <p className="text-slate-600">{monthlyData.month} · 参评人数：{monthlyData.totalEmployees}</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">平均得分</div>
          <div className="text-4xl font-bold text-blue-600 mb-2">{monthlyData.averageScore}</div>
          <div className="text-xs text-slate-500">/ 100</div>
        </Card>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">完成率</div>
          <div className="text-4xl font-bold text-emerald-600 mb-2">{monthlyData.completionRate}%</div>
          <div className="text-xs text-slate-500">目标完成情况</div>
        </Card>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">参评人数</div>
          <div className="text-4xl font-bold text-amber-600 mb-2">{monthlyData.totalEmployees}</div>
          <div className="text-xs text-slate-500">本月评定人数</div>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 部门得分对比 */}
        <Card className="bg-white border-0 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">部门得分对比</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData.departmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* 得分分布 */}
        <Card className="bg-white border-0 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">得分分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={monthlyData.scoreDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {monthlyData.scoreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 排名表格 */}
      <Card className="bg-white border-0 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">当月排名 TOP 5</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            导出数据
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">排名</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">员工</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">部门</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">得分</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">完成率</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.topPerformers.map((performer) => (
                <tr key={performer.rank} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                      {performer.rank}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-900">{performer.name}</td>
                  <td className="py-4 px-4 text-slate-600">{performer.department}</td>
                  <td className="py-4 px-4 text-right text-slate-900 font-semibold">{performer.score}</td>
                  <td className="py-4 px-4 text-right text-emerald-600 font-semibold">{performer.completion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
