import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Award } from 'lucide-react';

export default function AnnualPerformance() {
  // Mock 全年绩效数据
  const annualSummary = {
    year: '2024年',
    avgScore: 90.7,
    completionRate: 94.3,
    totalParticipants: 1248,
    topPerformer: '张秋实',
    topDepartment: '研究中心',
  };

  const monthlyPerformance = [
    { month: '1月', score: 88.2, completion: 92.1, quality: 85.5, innovation: 82.1 },
    { month: '2月', score: 89.5, completion: 93.8, quality: 87.2, innovation: 84.5 },
    { month: '3月', score: 90.8, completion: 95.2, quality: 89.1, innovation: 86.8 },
    { month: '4月', score: 92.4, completion: 98.2, quality: 91.5, innovation: 89.2 },
  ];

  const departmentAnnual = [
    { department: '研究中心', avgScore: 92.5, employees: 156, topEmployee: '张秋实', trend: '↑ 3.3' },
    { department: '产品部', avgScore: 90.2, employees: 203, topEmployee: '李明', trend: '↑ 2.7' },
    { department: '设计部', avgScore: 89.1, employees: 187, topEmployee: '王芳', trend: '↑ 2.3' },
    { department: '技术部', avgScore: 91.5, employees: 298, topEmployee: '刘强', trend: '↑ 2.4' },
    { department: '运营部', avgScore: 88.5, employees: 404, topEmployee: '陈丽', trend: '↑ 3.3' },
  ];

  const performanceDistribution = [
    { score: 95, count: 145 },
    { score: 90, count: 312 },
    { score: 85, count: 456 },
    { score: 80, count: 245 },
    { score: 75, count: 68 },
    { score: 70, count: 22 },
  ];

  const topEmployees = [
    { rank: 1, name: '张秋实', department: '研究中心', avgScore: 98.5, consistency: '99%' },
    { rank: 2, name: '李明', department: '产品部', avgScore: 97.2, consistency: '97%' },
    { rank: 3, name: '王芳', department: '设计部', avgScore: 96.8, consistency: '96%' },
    { rank: 4, name: '刘强', department: '技术部', avgScore: 96.1, consistency: '95%' },
    { rank: 5, name: '陈丽', department: '运营部', avgScore: 95.9, consistency: '94%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">全年绩效总结</h1>
        <p className="text-slate-600">{annualSummary.year} · 全年绩效评定总结报告</p>
      </div>

      {/* 年度统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">年度平均得分</div>
          <div className="text-3xl font-bold text-blue-600">{annualSummary.avgScore}</div>
          <div className="text-xs text-slate-500 mt-2">/ 100</div>
        </Card>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">完成率</div>
          <div className="text-3xl font-bold text-emerald-600">{annualSummary.completionRate}%</div>
          <div className="text-xs text-slate-500 mt-2">目标完成情况</div>
        </Card>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">参评人数</div>
          <div className="text-3xl font-bold text-amber-600">{annualSummary.totalParticipants}</div>
          <div className="text-xs text-slate-500 mt-2">全年评定人数</div>
        </Card>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">最佳员工</div>
          <div className="text-2xl font-bold text-purple-600">{annualSummary.topPerformer}</div>
          <div className="text-xs text-slate-500 mt-2">全年排名第1</div>
        </Card>
        <Card className="bg-white border-0 shadow-sm p-6">
          <div className="text-sm text-slate-600 mb-2">最佳部门</div>
          <div className="text-2xl font-bold text-indigo-600">{annualSummary.topDepartment}</div>
          <div className="text-xs text-slate-500 mt-2">部门平均分最高</div>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 月度趋势 */}
        <Card className="bg-white border-0 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">月度绩效趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" name="总体得分" strokeWidth={2} />
              <Line type="monotone" dataKey="quality" stroke="#10b981" name="质量评分" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 部门对比 */}
        <Card className="bg-white border-0 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">部门年度对比</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentAnnual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* 得分分布 */}
      <Card className="bg-white border-0 shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">全年得分分布</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" dataKey="score" name="得分" />
            <YAxis type="number" dataKey="count" name="人数" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="得分分布" data={performanceDistribution} fill="#3b82f6" />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      {/* 部门详情表格 */}
      <Card className="bg-white border-0 shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">部门年度统计</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">部门</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">年度平均分</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">人数</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">最佳员工</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">增长趋势</th>
              </tr>
            </thead>
            <tbody>
              {departmentAnnual.map((dept) => (
                <tr key={dept.department} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4 text-slate-900 font-medium">{dept.department}</td>
                  <td className="py-4 px-4 text-right text-slate-900 font-semibold">{dept.avgScore}</td>
                  <td className="py-4 px-4 text-right text-slate-600">{dept.employees}</td>
                  <td className="py-4 px-4 text-slate-900">{dept.topEmployee}</td>
                  <td className="py-4 px-4 text-right text-emerald-600 font-semibold">{dept.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 年度排名 */}
      <Card className="bg-white border-0 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Award size={20} className="text-amber-600" />
            全年排名 TOP 5
          </h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            导出年度报告
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">排名</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">员工</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">部门</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">年度平均分</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">稳定性</th>
              </tr>
            </thead>
            <tbody>
              {topEmployees.map((employee) => (
                <tr key={employee.rank} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold">
                      {employee.rank}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-900 font-medium">{employee.name}</td>
                  <td className="py-4 px-4 text-slate-600">{employee.department}</td>
                  <td className="py-4 px-4 text-right text-slate-900 font-semibold">{employee.avgScore}</td>
                  <td className="py-4 px-4 text-right text-emerald-600 font-semibold">{employee.consistency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
