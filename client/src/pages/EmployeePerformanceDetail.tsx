import { useState } from 'react';
import { useRoute } from 'wouter';
import { ArrowLeft, Download, MessageSquare, TrendingUp } from 'lucide-react';
import PerformanceLayout from '@/components/PerformanceLayout';

interface EmployeeDetail {
  id: string;
  rank: number;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  manager: string;
  avatar: string;
  avatarColor: string;
}

interface MonthlyScore {
  month: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

interface Feedback {
  id: string;
  reviewer: string;
  date: string;
  score: number;
  comment: string;
  category: string;
}

// Mock 数据
const mockEmployeeDetail: EmployeeDetail = {
  id: '1',
  rank: 1,
  name: '张秋实',
  department: '研究中心/架构',
  position: '高级架构师',
  email: 'zhang.qiushi@company.com',
  phone: '13800138000',
  joinDate: '2020-03-15',
  manager: '李明',
  avatar: '秋',
  avatarColor: 'bg-blue-500',
};

const mockMonthlyScores: MonthlyScore[] = [
  { month: '1月', score: 94.5, trend: 'up' },
  { month: '2月', score: 96.0, trend: 'up' },
  { month: '3月', score: 98.0, trend: 'up' },
  { month: '4月', score: 97.5, trend: 'down' },
  { month: '5月', score: 99.0, trend: 'up' },
  { month: '6月', score: 98.5, trend: 'stable' },
];

const mockFeedback: Feedback[] = [
  {
    id: '1',
    reviewer: '李明',
    date: '2023-09-15',
    score: 9.5,
    comment: '在架构设计方面表现出色，提出了多个创新方案，对团队技术提升贡献很大。',
    category: '技术能力',
  },
  {
    id: '2',
    reviewer: '王伟',
    date: '2023-09-10',
    score: 9.0,
    comment: '团队协作能力强，能够有效协调跨部门工作，沟通清晰有效。',
    category: '团队协作',
  },
  {
    id: '3',
    reviewer: '陈晶',
    date: '2023-09-05',
    score: 8.5,
    comment: '项目交付能力强，能够按时完成任务，质量控制到位。',
    category: '执行力',
  },
];

function EmployeePerformanceDetailContent() {
  const [, params] = useRoute('/employee/:id');
  const employeeId = params?.id || '1';

  // 在实际应用中，这里应该根据 employeeId 从 API 获取数据
  const employee = mockEmployeeDetail;
  const monthlyScores = mockMonthlyScores;
  const feedbacks = mockFeedback;

  const averageScore = (monthlyScores.reduce((sum, item) => sum + item.score, 0) / monthlyScores.length).toFixed(2);
  const averageFeedbackScore = (feedbacks.reduce((sum, item) => sum + item.score, 0) / feedbacks.length).toFixed(1);

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">员工绩效详情</h1>
              <p className="text-slate-600 text-sm mt-1">{employee.name} - {employee.position}</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
            <Download size={18} />
            <span>导出报告</span>
          </button>
        </div>
      </div>

      {/* Employee Info Card */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex items-start gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-6">
              <div className={`w-24 h-24 rounded-full ${employee.avatarColor} flex items-center justify-center text-white text-3xl font-bold`}>
                {employee.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{employee.name}</h2>
                <p className="text-slate-600 text-sm mt-1">{employee.department}</p>
                <p className="text-slate-600 text-sm">{employee.position}</p>
                <div className="mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-semibold">
                  排名: #{employee.rank}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-slate-600 text-sm font-medium">邮箱</label>
                  <p className="text-slate-900 font-medium mt-1">{employee.email}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm font-medium">电话</label>
                  <p className="text-slate-900 font-medium mt-1">{employee.phone}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm font-medium">入职日期</label>
                  <p className="text-slate-900 font-medium mt-1">{employee.joinDate}</p>
                </div>
                <div>
                  <label className="text-slate-600 text-sm font-medium">直属经理</label>
                  <p className="text-slate-900 font-medium mt-1">{employee.manager}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-slate-600 text-sm font-medium">平均绩效分</label>
              <TrendingUp size={18} className="text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{averageScore}</div>
            <p className="text-slate-500 text-xs mt-2">基于最近6个月数据</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-slate-600 text-sm font-medium">反馈评分</label>
              <MessageSquare size={18} className="text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{averageFeedbackScore}</div>
            <p className="text-slate-500 text-xs mt-2">基于 {feedbacks.length} 条反馈</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-slate-600 text-sm font-medium">最新月度分</label>
              <TrendingUp size={18} className="text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{monthlyScores[monthlyScores.length - 1].score}</div>
            <p className="text-slate-500 text-xs mt-2">{monthlyScores[monthlyScores.length - 1].month}</p>
          </div>
        </div>
      </div>

      {/* Monthly Performance Trend */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">月度绩效趋势</h3>
          <div className="flex items-end gap-4 h-64">
            {monthlyScores.map((item, index) => {
              const maxScore = 100;
              const height = (item.score / maxScore) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-200 rounded-lg overflow-hidden relative" style={{ height: '200px' }}>
                    <div
                      className="w-full bg-blue-600 rounded-lg transition-all hover:bg-blue-700"
                      style={{ height: `${height}%`, marginTop: 'auto' }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 font-semibold text-sm">{item.score}</p>
                    <p className="text-slate-600 text-xs">{item.month}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">360度反馈</h3>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-900">{feedback.reviewer}</p>
                    <p className="text-slate-600 text-sm">{feedback.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < Math.floor(feedback.score) ? 'text-yellow-400' : 'text-slate-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-slate-900 font-semibold">{feedback.score}</span>
                  </div>
                </div>
                <p className="text-slate-700 text-sm">{feedback.comment}</p>
                <p className="text-slate-500 text-xs mt-3">{feedback.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 py-6">
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">
            编辑评价
          </button>
          <button className="px-6 py-3 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">
            查看历史记录
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmployeePerformanceDetail() {
  return (
    <PerformanceLayout>
      <EmployeePerformanceDetailContent />
    </PerformanceLayout>
  );
}
