import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Filter, ChevronDown } from 'lucide-react';
import PerformanceLayout from '@/components/PerformanceLayout';

interface EmployeePerformance {
  rank: number;
  name: string;
  department: string;
  firstLetter: string;
  avatarColor: string;
  jan: number;
  feb: number;
  mar: number;
  quarterAvg: number;
  deptRank: number;
  finalScore: number;
}

const mockEmployees: EmployeePerformance[] = [
  {
    rank: 1,
    name: '张秋实',
    department: '研究中心/架构',
    firstLetter: '秋',
    avatarColor: 'bg-blue-500',
    jan: 94.5,
    feb: 96.0,
    mar: 98.0,
    quarterAvg: 96.17,
    deptRank: 1.05,
    finalScore: 101.0,
  },
  {
    rank: 2,
    name: '王伟',
    department: '市场部/品牌组',
    firstLetter: '王',
    avatarColor: 'bg-green-500',
    jan: 92.0,
    feb: 95.0,
    mar: 93.5,
    quarterAvg: 93.50,
    deptRank: 1.02,
    finalScore: 95.37,
  },
  {
    rank: 3,
    name: '李璇',
    department: '销售部/华东区',
    firstLetter: '李',
    avatarColor: 'bg-purple-500',
    jan: 90.0,
    feb: 91.5,
    mar: 96.0,
    quarterAvg: 92.50,
    deptRank: 1.00,
    finalScore: 92.50,
  },
  {
    rank: 4,
    name: '刘洋',
    department: '人力资源/绩效',
    firstLetter: '刘',
    avatarColor: 'bg-cyan-500',
    jan: 88.5,
    feb: 90.0,
    mar: 92.0,
    quarterAvg: 90.17,
    deptRank: 1.00,
    finalScore: 90.17,
  },
  {
    rank: 5,
    name: '陈晶',
    department: '客服部/大客户',
    firstLetter: '陈',
    avatarColor: 'bg-red-500',
    jan: 85.0,
    feb: 88.0,
    mar: 87.5,
    quarterAvg: 86.83,
    deptRank: 0.98,
    finalScore: 85.09,
  },
];

function MonthlyPerformanceWorkbenchContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalEmployees = 1248;
  const itemsPerPage = 5;

  return (
    <div className="bg-surface">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-8">
        <h1 className="text-3xl font-bold text-on-surface mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
          季度绩效概览
        </h1>
        <p className="text-on-surface-variant text-sm">
          基于 2023 年第 3 季度的绩效指标评估，旨在现阶段各层级的战略对齐程度与执行力产出。
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Left: Statistics */}
          <div className="col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-sm text-on-surface-variant mb-2">平均得分</div>
                <div className="text-4xl font-bold text-primary" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  92.4
                </div>
                <div className="text-xs text-on-surface-variant mt-1">/ 100</div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-sm text-on-surface-variant mb-2">完成率</div>
                <div className="text-4xl font-bold text-primary" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  98.2%
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-sm text-on-surface-variant mb-2">参评人数</div>
                <div className="text-4xl font-bold text-primary" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  1,248
                </div>
              </div>
            </div>
          </div>

          {/* Right: Featured Card */}
          <div className="bg-gradient-to-br from-primary to-primary-dim rounded-xl p-6 text-white">
            <div className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              Q3 FINALIST
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
              季度最佳绩效员工
            </h3>
            <p className="text-sm text-white text-opacity-90 mb-4">战略研究中心·张秋实</p>
            <button className="w-full bg-white text-primary font-semibold py-2 rounded-lg hover:bg-opacity-90 transition-opacity">
              查看个人报告
            </button>
          </div>
        </div>

        {/* Employee Performance Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-on-surface" style={{ fontFamily: 'Manrope, sans-serif' }}>
              2023年第3季度个人绩效名单表
            </h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} />
                筛选
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                <Download size={16} />
                导出数据
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-gray-200">
                  <th className="px-6 py-3 text-left font-semibold text-on-surface">排名</th>
                  <th className="px-6 py-3 text-left font-semibold text-on-surface">员工信息</th>
                  <th className="px-6 py-3 text-left font-semibold text-on-surface">所属部门</th>
                  <th className="px-6 py-3 text-right font-semibold text-on-surface">1月总分</th>
                  <th className="px-6 py-3 text-right font-semibold text-on-surface">2月总分</th>
                  <th className="px-6 py-3 text-right font-semibold text-on-surface">3月总分</th>
                  <th className="px-6 py-3 text-right font-semibold text-on-surface">季度平均分</th>
                  <th className="px-6 py-3 text-right font-semibold text-on-surface">部门内位次</th>
                  <th className="px-6 py-3 text-right font-semibold text-on-surface">最终得分</th>
                  <th className="px-6 py-3 text-center font-semibold text-on-surface">操作</th>
                </tr>
              </thead>
              <tbody>
                {mockEmployees.map((emp, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-on-surface font-medium">{emp.rank}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${emp.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                          {emp.firstLetter}
                        </div>
                        <span className="text-on-surface font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{emp.department}</td>
                    <td className="px-6 py-4 text-right text-on-surface font-medium">{emp.jan.toFixed(1)}</td>
                    <td className="px-6 py-4 text-right text-on-surface font-medium">{emp.feb.toFixed(1)}</td>
                    <td className="px-6 py-4 text-right text-on-surface font-medium">{emp.mar.toFixed(1)}</td>
                    <td className="px-6 py-4 text-right text-on-surface font-medium">{emp.quarterAvg.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-on-surface font-medium">{emp.deptRank.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-primary font-bold">{emp.finalScore.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-primary hover:text-primary-dim transition-colors font-medium">
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-on-surface-variant">
              共 {totalEmployees} 名员工 1 页绩效数据
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-on-surface-variant hover:bg-gray-100 rounded transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="px-3 py-1 text-sm font-medium bg-primary text-white rounded">1</button>
              <button className="px-3 py-1 text-sm text-on-surface hover:bg-gray-100 rounded transition-colors">2</button>
              <button className="px-3 py-1 text-sm text-on-surface hover:bg-gray-100 rounded transition-colors">3</button>
              <button className="px-3 py-1 text-sm text-on-surface-variant hover:bg-gray-100 rounded transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Quarterly Trend Chart */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-on-surface" style={{ fontFamily: 'Manrope, sans-serif' }}>
              📈 季度环比提升趋势
            </h3>
            <a href="#" className="text-primary hover:text-primary-dim transition-colors text-sm font-medium">
              查看完整诊断报告 &gt;
            </a>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-on-surface-variant">
            [季度对比图表 - Q1, Q2, Q3, Q4(预)]
          </div>
        </div>

        {/* Management Suggestions */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-on-surface mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            💡 管理员策与建议
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p className="text-sm text-on-surface">
                研究中心全体在在专利的学位分与技术点，建议作为融合人才入库。
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <p className="text-sm text-on-surface">
                生生销售主任在3月业绩对比基础较好，涨升了，2月的均衡下记。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MonthlyPerformanceWorkbench() {
  return (
    <PerformanceLayout activeNav="monthly-workbench">
      <MonthlyPerformanceWorkbenchContent />
    </PerformanceLayout>
  );
}
