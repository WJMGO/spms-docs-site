/**
 * 文档解析结果审查和确认组件
 * 显示 LLM 提取的数据，允许用户编辑和确认
 */

import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Edit2, Save, RotateCcw } from 'lucide-react';
import { ParsedDocumentData } from '@shared/document-parser-types';

interface ParseResultReviewProps {
  parseResult: ParsedDocumentData;
  fileName: string;
  onConfirm: (adjustedData: ParsedDocumentData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ParseResultReview({
  parseResult,
  fileName,
  onConfirm,
  onCancel,
  isLoading = false,
}: ParseResultReviewProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<ParsedDocumentData>(parseResult);
  const [confirming, setConfirming] = useState(false);

  const handleFieldChange = (field: keyof ParsedDocumentData, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm(editedData);
    } finally {
      setConfirming(false);
    }
  };

  const handleReset = () => {
    setEditedData(parseResult);
    setEditMode(false);
  };

  const confidenceLevel = parseResult.extractionConfidence || 0.8;
  const isHighConfidence = confidenceLevel >= 0.8;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">解析结果审查</h2>
            <p className="text-sm text-gray-500 mt-1">{fileName}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={confirming}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Confidence Alert */}
          <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
              isHighConfidence
                ? 'bg-green-50 border border-green-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}
          >
            {isHighConfidence ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`font-medium ${
                  isHighConfidence ? 'text-green-900' : 'text-yellow-900'
                }`}
              >
                {isHighConfidence ? '高置信度' : '低置信度'}
              </p>
              <p
                className={`text-sm ${
                  isHighConfidence ? 'text-green-700' : 'text-yellow-700'
                }`}
              >
                提取置信度: {(confidenceLevel * 100).toFixed(0)}%
                {!isHighConfidence && ' - 建议检查数据准确性'}
              </p>
            </div>
          </div>

          {/* Employee Info Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>员工信息</span>
              {editMode && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  编辑中
                </span>
              )}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  员工姓名
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editedData.employeeName || ''}
                    onChange={(e) => handleFieldChange('employeeName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.employeeName || '-'}
                  </p>
                )}
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  员工 ID
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editedData.employeeId || ''}
                    onChange={(e) => handleFieldChange('employeeId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.employeeId || '-'}
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  部门
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editedData.department || ''}
                    onChange={(e) => handleFieldChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.department || '-'}
                  </p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  职位
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editedData.position || ''}
                    onChange={(e) => handleFieldChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.position || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Performance Scores Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">绩效评分（6个维度）</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Daily Work Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  日常工作 (满分 100)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={editedData.dailyWorkScore || ''}
                    onChange={(e) =>
                      handleFieldChange('dailyWorkScore', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.dailyWorkScore !== undefined ? editedData.dailyWorkScore : '-'}
                  </p>
                )}
              </div>

              {/* Work Quality Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  工作质量 (满分 15)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={editedData.workQualityScore || ''}
                    onChange={(e) =>
                      handleFieldChange('workQualityScore', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.workQualityScore !== undefined ? editedData.workQualityScore : '-'}
                  </p>
                )}
              </div>

              {/* Personal Goal Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  个人目标 (满分 15)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={editedData.personalGoalScore || ''}
                    onChange={(e) =>
                      handleFieldChange('personalGoalScore', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.personalGoalScore !== undefined ? editedData.personalGoalScore : '-'}
                  </p>
                )}
              </div>

              {/* Department Review Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  部门互评 (满分 5)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={editedData.departmentReviewScore || ''}
                    onChange={(e) =>
                      handleFieldChange('departmentReviewScore', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.departmentReviewScore !== undefined ? editedData.departmentReviewScore : '-'}
                  </p>
                )}
              </div>

              {/* Bonus Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  绩效加分 (满分 15)
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={editedData.bonusScore || ''}
                    onChange={(e) =>
                      handleFieldChange('bonusScore', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.bonusScore !== undefined ? editedData.bonusScore : '-'}
                  </p>
                )}
              </div>

              {/* Penalty Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  绩效减分
                </label>
                {editMode ? (
                  <input
                    type="number"
                    value={editedData.penaltyScore || ''}
                    onChange={(e) =>
                      handleFieldChange('penaltyScore', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {editedData.penaltyScore !== undefined ? editedData.penaltyScore : '-'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Total Score and Rank */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                总分
              </label>
              {editMode ? (
                <input
                  type="number"
                  value={editedData.totalScore || ''}
                  onChange={(e) =>
                    handleFieldChange('totalScore', e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900 font-semibold">
                  {editedData.totalScore !== undefined ? editedData.totalScore : '-'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排名
              </label>
              {editMode ? (
                <input
                  type="number"
                  value={editedData.rank || ''}
                  onChange={(e) =>
                    handleFieldChange('rank', e.target.value ? parseInt(e.target.value, 10) : undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                  {editedData.rank !== undefined ? editedData.rank : '-'}
                </p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              评价和备注
            </label>
            {editMode ? (
              <textarea
                value={editedData.comments || ''}
                onChange={(e) => handleFieldChange('comments', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-900 whitespace-pre-wrap">
                {editedData.comments || '-'}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          {editMode ? (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2"
                disabled={confirming}
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition disabled:opacity-50"
                disabled={confirming}
              >
                取消编辑
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {confirming ? '保存中...' : '保存并确认'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition disabled:opacity-50"
                disabled={isLoading}
              >
                取消
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition disabled:opacity-50 flex items-center gap-2"
                disabled={isLoading}
              >
                <Edit2 className="w-4 h-4" />
                编辑
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading ? '处理中...' : '确认'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
