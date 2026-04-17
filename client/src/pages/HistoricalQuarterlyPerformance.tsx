import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import PerformanceLayout from '@/components/PerformanceLayout';

function HistoricalQuarterlyPerformanceContent() {
  // Mock 历史季度数据
  const quarterlyData = [
    { quarter: 'Q1 2023', avgScore: 88.5, completion: 91.2, participants: 1050, ranking: 3 },
    { quarter: 'Q2 2023', avgScore: 89.8, completion: 93.5, participants: 1120, ranking: 2 },
    { quarter: 'Q3 2023', avgScore: 91.2, completion: 95.8, participants: 1200, ranking: 1 },
    { quarter: 'Q4 2023', avgScore: 92.4, completion: 98.2, participants: 1248, ranking: 1 },
  ];

  const departmentQuarterlyTrend = [
    { quarter: 'Q1', 研究中心: 89.2, 产品部: 87.1, 设计部: 85.8, 技术部: 88.5, 运营部: 84.2 },
    { quarter: 'Q2', 研究中心: 90.5, 产品部: 88.9, 设计部: 87.2, 技术部: 89.8, 运营部: 86.1 },
    { quarter: 'Q3', 研究中心: 92.1, 产品部: 90.5, 设计部: 89.1, 技术部: 91.2, 运营部: 88.5 },
    { quarter: 'Q4', 研究中心: 94.2, 产品部: 92.8, 设计部: 91.5, 技术部: 93.1, 运营部: 90.2 },
  ];

  const quarterlyRanking = [
    { quarter: 'Q1', rank1: '张秋实', rank2: '李明', rank3: '王芳', avgScore: 88.5 },
    { quarter: 'Q2', rank1: '李明', rank2: '张秋实', rank3: '陈丽', avgScore: 89.8 },
    { quarter: 'Q3', rank1: '张秋实', rank2: '王芳', rank3: '刘强', avgScore: 91.2 },
    { quarter: 'Q4', rank1: '张秋实', rank2: '李明', rank3: '王芳', avgScore: 92.4 },
  ];

  const dimensionComparison = [
    { dimension: '目标完成', Q1: 85, Q2: 88, Q3: 92, Q4: 95 },
    { dimension: '工作质量', Q1: 87, Q2: 89, Q3: 91, Q4: 94 },
    { dimension: '创新能力', Q1: 82, Q2: 85, Q3: 89, Q4: 92 },
    { dimension: '团队协作', Q1: 88, Q2: 90, Q3: 93, Q4: 96 },
    { dimension: '专业发展', Q1: 84, Q2: 86, Q3: 90, Q4: 93 },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">历史季度绩效</h1>
        <p className="text-slate-600">查看过去4个季度的绩效数据对比和趋势分析</p>
      </div>

      {/* 季度对比卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quarterlyData.map((quarter) => (
          <Card key={quarter.quarter} className="bg-white border-0 shadow-sm p-6">
            <div className="text-sm text-slate-600 mb-2">{quarter.quarter}</div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{quarter.avgScore}</div>
            <div className="flex justify-between text-xs text-slate-500 mb-3">
              <span>完成率: {quarter.completion}%</span>
              <span>排名: #{quarter.ranking}</span>
            </div>
            <div className="text-xs text-slate-500">参评人数: {quarter.participants}</div>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 季度趋势 */}
        <Card className="bg-white border-0 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">季度绩效趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" name="平均得分" strokeWidth={2} />
              <Line type="monotone" dataKey="completion" stroke="#10b981" name="完成率" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 部门季度对比 */}
        <Card className="bg-white border-0 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">部门季度对比</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentQuarterlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="研究中心" fill="#3b82f6" />
              <Bar dataKey="产品部" fill="#10b981" />
              <Bar dataKey="设计部" fill="#f59e0b" />
              <Bar dataKey="技术部" fill="#8b5cf6" />
              <Bar dataKey="运营部" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 维度对比 */}
      <Card className="bg-white border-0 shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">绩效维度季度对比</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={dimensionComparison}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="dimension" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Q1" dataKey="Q1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
            <Radar name="Q2" dataKey="Q2" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
            <Radar name="Q3" dataKey="Q3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
            <Radar name="Q4" dataKey="Q4" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* 季度排名表格 */}
      <Card className="bg-white border-0 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">季度排名 TOP 3</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            导出报告
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">季度</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">第1名</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">第2名</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">第3名</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">平均得分</th>
              </tr>
            </thead>
            <tbody>
              {quarterlyRanking.map((quarter) => (
                <tr key={quarter.quarter} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4 text-slate-900 font-semibold">{quarter.quarter}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">🥇</span>
                      <span className="text-slate-900">{quarter.rank1}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">🥈</span>
                      <span className="text-slate-900">{quarter.rank2}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">🥉</span>
                      <span className="text-slate-900">{quarter.rank3}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-slate-900 font-semibold">{quarter.avgScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function HistoricalQuarterlyPerformance() {
  return (
    <PerformanceLayout activeNav="historical-quarterly">
      <HistoricalQuarterlyPerformanceContent />
    </PerformanceLayout>
  );
}
