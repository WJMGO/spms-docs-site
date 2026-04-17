import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp } from 'lucide-react';
import PerformanceLayout from '@/components/PerformanceLayout';

function HistoricalMonthlyPerformanceContent() {
  const [selectedMetric, setSelectedMetric] = useState('average');

  // Mock 历史月度数据
  const monthlyTrend = [
    { month: '1月', average: 88.2, completion: 92.1, participants: 1100 },
    { month: '2月', average: 89.5, completion: 93.8, participants: 1150 },
    { month: '3月', average: 90.8, completion: 95.2, participants: 1200 },
    { month: '4月', average: 92.4, completion: 98.2, participants: 1248 },
  ];

  const departmentTrend = [
    { month: '1月', 研究中心: 91.2, 产品部: 87.5, 设计部: 86.8, 技术部: 89.1, 运营部: 85.2 },
    { month: '2月', 研究中心: 92.1, 产品部: 88.9, 设计部: 87.5, 技术部: 90.2, 运营部: 86.5 },
    { month: '3月', 研究中心: 93.5, 产品部: 90.2, 设计部: 89.1, 技术部: 91.8, 运营部: 88.2 },
    { month: '4月', 研究中心: 94.2, 产品部: 92.8, 设计部: 91.5, 技术部: 93.1, 运营部: 90.2 },
  ];

  const monthlyStats = [
    { month: '1月', avgScore: 88.2, maxScore: 98.5, minScore: 72.1, completionRate: 92.1 },
    { month: '2月', avgScore: 89.5, maxScore: 99.1, minScore: 73.5, completionRate: 93.8 },
    { month: '3月', avgScore: 90.8, maxScore: 99.8, minScore: 74.2, completionRate: 95.2 },
    { month: '4月', avgScore: 92.4, maxScore: 100.0, minScore: 75.8, completionRate: 98.2 },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">历史月度绩效</h1>
        <p className="text-slate-600">查看过去12个月的绩效数据趋势和对比分析</p>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">最高得分</div>
          <div className="text-3xl font-bold text-blue-600">100.0</div>
          <div className="text-xs text-slate-500 mt-2">4月最高分</div>
        </Card>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">最低得分</div>
          <div className="text-3xl font-bold text-amber-600">72.1</div>
          <div className="text-xs text-slate-500 mt-2">1月最低分</div>
        </Card>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">平均增长</div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-emerald-600">4.2</div>
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
          <div className="text-xs text-slate-500 mt-2">环比增长</div>
        </Card>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">完成率</div>
          <div className="text-3xl font-bold text-emerald-600">98.2%</div>
          <div className="text-xs text-slate-500 mt-2">4月完成率</div>
        </Card>
      </div>

      {/* 趋势图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 总体趋势 */}
        <Card className="bg-white border-0 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">总体绩效趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#3b82f6" name="平均得分" strokeWidth={2} />
              <Line type="monotone" dataKey="completion" stroke="#10b981" name="完成率" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 部门对比 */}
        <Card className="bg-white border-0 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">部门绩效对比</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={departmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="研究中心" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="产品部" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="设计部" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="技术部" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="运营部" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 月度统计表格 */}
      <Card className="bg-white border-0 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">月度统计详情</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            导出报告
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">月份</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">平均得分</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">最高分</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">最低分</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">完成率</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">环比变化</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((stat, index) => (
                <tr key={stat.month} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4 text-slate-900 font-medium">{stat.month}</td>
                  <td className="py-4 px-4 text-right text-slate-900 font-semibold">{stat.avgScore}</td>
                  <td className="py-4 px-4 text-right text-emerald-600">{stat.maxScore}</td>
                  <td className="py-4 px-4 text-right text-amber-600">{stat.minScore}</td>
                  <td className="py-4 px-4 text-right text-slate-900 font-semibold">{stat.completionRate}%</td>
                  <td className="py-4 px-4 text-right">
                    {index > 0 ? (
                      <span className="text-emerald-600 font-semibold">
                        ↑ {(stat.avgScore - monthlyStats[index - 1].avgScore).toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function HistoricalMonthlyPerformance() {
  return (
    <PerformanceLayout activeNav="historical-monthly">
      <HistoricalMonthlyPerformanceContent />
    </PerformanceLayout>
  );
}
