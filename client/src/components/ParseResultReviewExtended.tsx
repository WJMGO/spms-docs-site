/**
 * 扩展的文档解析结果审查组件
 * 包含工作质量详情编辑功能
 */

import React, { useState } from 'react';
import { X, Edit2, Save, RotateCcw } from 'lucide-react';
import { ParsedDocumentData, WorkQualityDetails } from '@shared/document-parser-types';
import WorkQualityDetailsEditor from './WorkQualityDetailsEditor';

interface ParseResultReviewExtendedProps {
  parseResult: ParsedDocumentData;
  fileName: string;
  onConfirm: (adjustedData: ParsedDocumentData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ParseResultReviewExtended({
  parseResult,
  fileName,
  onConfirm,
  onCancel,
  isLoading = false,
}: ParseResultReviewExtendedProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'workQuality'>('basic');
  const [editedData, setEditedData] = useState<ParsedDocumentData>(parseResult);
  const [workQualityDetails, setWorkQualityDetails] = useState<WorkQualityDetails>(
    parseResult.workQualityDetails || {}
  );
  const [editMode, setEditMode] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleWorkQualityChange = (details: WorkQualityDetails) => {
    setWorkQualityDetails(details);
    setEditedData(prev => ({
      ...prev,
      workQualityDetails: details,
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
    setWorkQualityDetails(parseResult.workQualityDetails || {});
    setEditMode(false);
  };

  // 检查工作质量详情中是否有缺失数据
  const hasMissingWorkQualityData = Object.entries(workQualityDetails).some(
    ([key, value]) => key.endsWith('Missing') && value === true
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'basic'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            基本信息
          </button>
          <button
            onClick={() => setActiveTab('workQuality')}
            className={`px-4 py-3 font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'workQuality'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            工作质量详情
            {hasMissingWorkQualityData && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                有缺失
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'basic' ? (
            <div className="p-6">
              <p className="text-gray-600">基本信息编辑</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <WorkQualityDetailsEditor
                data={workQualityDetails}
                onChange={handleWorkQualityChange}
                readOnly={!editMode}
              />
            </div>
          )}
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
                disabled={isLoading || hasMissingWorkQualityData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:bg-gray-400"
                title={hasMissingWorkQualityData ? '请先补充所有缺失的工作质量数据' : ''}
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
