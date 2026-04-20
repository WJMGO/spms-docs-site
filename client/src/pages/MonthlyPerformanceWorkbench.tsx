import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, Download, Filter, ChevronDown, Search, ArrowUpDown, Upload } from 'lucide-react';
import PerformanceLayout from '@/components/PerformanceLayout';
import DocumentUploader from '@/components/DocumentUploader';
import { trpc } from '@/trpc';
import { toast } from 'sonner';

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
  {
    rank: 6,
    name: '李明',
    department: '研究中心/架构',
    firstLetter: '明',
    avatarColor: 'bg-yellow-500',
    jan: 89.0,
    feb: 91.0,
    mar: 90.5,
    quarterAvg: 90.17,
    deptRank: 0.95,
    finalScore: 85.66,
  },
  {
    rank: 7,
    name: '王芳',
    department: '市场部/品牌组',
    firstLetter: '芳',
    avatarColor: 'bg-pink-500',
    jan: 87.0,
    feb: 89.0,
    mar: 88.5,
    quarterAvg: 88.17,
    deptRank: 0.92,
    finalScore: 81.12,
  },
  {
    rank: 8,
    name: '张三',
    department: '销售部/华东区',
    firstLetter: '三',
    avatarColor: 'bg-indigo-500',
    jan: 86.0,
    feb: 87.5,
    mar: 89.0,
    quarterAvg: 87.50,
    deptRank: 0.90,
    finalScore: 78.75,
  },
];

type SortField = 'name' | 'finalScore' | 'quarterAvg' | 'jan' | 'feb' | 'mar' | 'deptRank' | null;
type SortOrder = 'asc' | 'desc';

function MonthlyPerformanceWorkbenchContent() {
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [scoreRange, setScoreRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const totalEmployees = 1248;
  const itemsPerPage = 5;

  // 获取所有部门列表
  const departments = useMemo(() => {
    const depts = new Set(mockEmployees.map(emp => emp.department));
    return Array.from(depts).sort();
  }, []);

  // 筛选和排序数据
  const filteredAndSortedData = useMemo(() => {
    let result = [...mockEmployees];

    // 按搜索关键词筛选
    if (searchQuery) {
      result = result.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 按部门筛选
    if (selectedDepartment) {
      result = result.filter(emp => emp.department === selectedDepartment);
    }

    // 按分数范围筛选
    result = result.filter(emp => emp.finalScore >= scoreRange.min && emp.finalScore <= scoreRange.max);

    // 排序
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField as keyof EmployeePerformance];
        const bValue = b[sortField as keyof EmployeePerformance];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return result;
  }, [searchQuery, selectedDepartment, scoreRange, sortField, sortOrder]);

  // 分页
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    setScoreRange({ min: 0, max: 100 });
    setSortField(null);
    setSortOrder('asc');
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          季度绩效概览
        </h1>
        <p className="text-slate-600 text-sm">
          基于 2023 年第 3 季度的绩效指标评估，旨在现阶段各层级的战略对齐程度与执行力产出。
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6 grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="text-slate-600 text-sm font-medium mb-2">平均得分</div>
          <div className="text-3xl font-bold text-slate-900">92.4</div>
          <div className="text-slate-500 text-xs mt-2">/ 100</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="text-slate-600 text-sm font-medium mb-2">完成率</div>
          <div className="text-3xl font-bold text-slate-900">98.2%</div>
          <div className="text-slate-500 text-xs mt-2">评估完成</div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="text-slate-600 text-sm font-medium mb-2">参评人数</div>
          <div className="text-3xl font-bold text-slate-900">1,248</div>
          <div className="text-slate-500 text-xs mt-2">总人数</div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="搜索员工名称或部门..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter size={18} className="text-slate-600" />
              <span className="text-slate-600 font-medium">筛选</span>
            </button>

            {/* Upload Button */}
            <button
              onClick={() => setShowUploader(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload size={18} />
              <span>上传文档</span>
            </button>

            {/* Download Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
              <Download size={18} />
              <span>导出</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">部门</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">全部部门</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Score Range Min */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">最低分数</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scoreRange.min}
                    onChange={(e) => {
                      setScoreRange({ ...scoreRange, min: Number(e.target.value) });
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Score Range Max */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">最高分数</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scoreRange.max}
                    onChange={(e) => {
                      setScoreRange({ ...scoreRange, max: Number(e.target.value) });
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                重置筛选
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div className="px-8 py-4">
        <p className="text-slate-600 text-sm">
          显示 {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} 到 {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} 条，共 {filteredAndSortedData.length} 条记录
        </p>
      </div>

      {/* Table */}
      <div className="px-8 pb-8">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">排名</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">员工信息</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">所属部门</th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('jan')}
                    className="flex items-center gap-1 ml-auto hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900">1月分</span>
                    {sortField === 'jan' && <ArrowUpDown size={14} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('feb')}
                    className="flex items-center gap-1 ml-auto hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900">2月分</span>
                    {sortField === 'feb' && <ArrowUpDown size={14} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('mar')}
                    className="flex items-center gap-1 ml-auto hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900">3月分</span>
                    {sortField === 'mar' && <ArrowUpDown size={14} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('quarterAvg')}
                    className="flex items-center gap-1 ml-auto hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900">季度平均</span>
                    {sortField === 'quarterAvg' && <ArrowUpDown size={14} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('deptRank')}
                    className="flex items-center gap-1 ml-auto hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900">加权系数</span>
                    {sortField === 'deptRank' && <ArrowUpDown size={14} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSort('finalScore')}
                    className="flex items-center gap-1 ml-auto hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900">最终得分</span>
                    {sortField === 'finalScore' && <ArrowUpDown size={14} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((employee, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{employee.rank}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${employee.avatarColor} flex items-center justify-center text-white font-semibold`}>
                        {employee.firstLetter}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{employee.department}</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-900">{employee.jan.toFixed(1)}</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-900">{employee.feb.toFixed(1)}</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-900">{employee.mar.toFixed(1)}</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-900">{employee.quarterAvg.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-900">{employee.deptRank.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">{employee.finalScore.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setLocation(`/employee/${employee.rank}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedData.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-600 text-sm">没有找到匹配的记录</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-600">
            第 {currentPage} 页，共 {totalPages} 页
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-900 text-white'
                      : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Uploader Modal */}
      {showUploader && (
        <DocumentUploader
          onUpload={async (files) => {
            setIsUploading(true);
            try {
              // 将文件转换为 Base64
              const filePromises = files.map(file => {
                return new Promise<{ fileName: string; fileContent: string; mimeType: string }>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    resolve({
                      fileName: file.name,
                      fileContent: base64,
                      mimeType: file.type,
                    });
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
              });

              const fileData = await Promise.all(filePromises);

              // 批量解析文档
              const parseBatchMutation = trpc.documentParser.parseBatchDocuments.useMutation();
              const result = await new Promise((resolve, reject) => {
                parseBatchMutation.mutate(
                  { documents: fileData },
                  {
                    onSuccess: (data) => resolve(data),
                    onError: (error) => reject(error),
                  }
                );
              });

              const data = result as any;
              if (data.success) {
                toast.success(`成功解析 ${data.successCount} 个文件`);
                if (data.failureCount > 0) {
                  toast.error(`${data.failureCount} 个文件解析失败`);
                }
                setShowUploader(false);
              } else {
                toast.error('文档解析失败，请重试');
              }
            } catch (error) {
              console.error('上传失败:', error);
              toast.error('上传失败，请重试');
            } finally {
              setIsUploading(false);
            }
          }}
          onClose={() => setShowUploader(false)}
          isLoading={isUploading}
        />
      )}
    </div>
  );
}

export default function MonthlyPerformanceWorkbench() {
  return (
    <PerformanceLayout>
      <MonthlyPerformanceWorkbenchContent />
    </PerformanceLayout>
  );
}
