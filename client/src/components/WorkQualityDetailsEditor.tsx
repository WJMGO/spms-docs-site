/**
 * 工作质量详情编辑组件
 * 支持自动填充和手动输入缺失的工作质量数据
 */

import React, { useState, useMemo } from 'react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { WorkQualityDetails } from '@shared/document-parser-types';

interface WorkQualityDetailsEditorProps {
  data: WorkQualityDetails;
  onChange: (data: WorkQualityDetails) => void;
  readOnly?: boolean;
}

interface DetailField {
  key: keyof WorkQualityDetails;
  label: string;
  type: 'number' | 'boolean' | 'text';
  maxValue?: number;
  isMissingKey?: keyof WorkQualityDetails;
  description?: string;
}

const DETAIL_FIELDS: DetailField[] = [
  {
    key: 'codeReviewCount',
    label: '代码走查次数',
    type: 'number',
    isMissingKey: 'codeReviewMissing',
    description: '本周期内进行的代码走查次数',
  },
  {
    key: 'codeReviewScore',
    label: '代码走查得分',
    type: 'number',
    maxValue: 100,
    description: '代码走查的质量评分',
  },
  {
    key: 'codeAuditCount',
    label: '代码审核次数',
    type: 'number',
    isMissingKey: 'codeAuditMissing',
    description: '本周期内进行的代码审核次数',
  },
  {
    key: 'codeAuditScore',
    label: '代码审核得分',
    type: 'number',
    maxValue: 100,
    description: '代码审核的质量评分',
  },
  {
    key: 'bugReturnRate',
    label: 'Bug 打回率 (%)',
    type: 'number',
    maxValue: 100,
    isMissingKey: 'bugReturnRateMissing',
    description: '代码审核中被打回的 Bug 比率',
  },
  {
    key: 'bugReturnRateScore',
    label: 'Bug 打回率得分',
    type: 'number',
    maxValue: 100,
    description: '根据打回率计算的得分',
  },
  {
    key: 'personalBugCount',
    label: '个人 Bug 有效打回数',
    type: 'number',
    isMissingKey: 'personalBugMissing',
    description: '本人发现并有效打回的 Bug 数量',
  },
  {
    key: 'personalBugScore',
    label: '个人 Bug 打回得分',
    type: 'number',
    maxValue: 100,
    description: '根据打回数量计算的得分',
  },
  {
    key: 'overdueProblemsAchieved',
    label: '超期问题部门达成',
    type: 'boolean',
    isMissingKey: 'overdueProblemsMissing',
    description: '部门是否达成超期问题解决目标',
  },
  {
    key: 'overdueProblemsScore',
    label: '超期问题得分',
    type: 'number',
    maxValue: 100,
    description: '根据超期问题达成情况的得分',
  },
  {
    key: 'designReviewCount',
    label: '设计评审次数',
    type: 'number',
    isMissingKey: 'designReviewMissing',
    description: '本周期内参与的设计评审次数',
  },
  {
    key: 'designReviewScore',
    label: '设计评审得分',
    type: 'number',
    maxValue: 100,
    description: '设计评审的质量评分',
  },
  {
    key: 'totalScore',
    label: '工作质量总分',
    type: 'number',
    maxValue: 100,
    description: '所有工作质量指标的总分',
  },
];

export default function WorkQualityDetailsEditor({
  data,
  onChange,
  readOnly = false,
}: WorkQualityDetailsEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['codeReview', 'codeAudit', 'bugReturn', 'personalBug', 'overdue', 'design', 'total'])
  );

  // 计算缺失的字段
  const missingFields = useMemo(() => {
    const missing: string[] = [];
    DETAIL_FIELDS.forEach(field => {
      if (field.isMissingKey && data[field.isMissingKey]) {
        missing.push(field.label);
      }
    });
    return missing;
  }, [data]);

  const hasMissingData = missingFields.length > 0;

  const handleFieldChange = (key: keyof WorkQualityDetails, value: any) => {
    onChange({
      ...data,
      [key]: value === '' ? undefined : value,
    });
  };

  const handleMarkAsFound = (missingKey: keyof WorkQualityDetails) => {
    onChange({
      ...data,
      [missingKey]: false,
    });
  };

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  const renderField = (field: DetailField) => {
    const isMissing = field.isMissingKey ? data[field.isMissingKey] : false;

    return (
      <div key={field.key} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {isMissing && (
              <span className="ml-2 inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                缺失
              </span>
            )}
          </label>
          {isMissing && (
            <button
              onClick={() => handleMarkAsFound(field.isMissingKey!)}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              disabled={readOnly}
            >
              <Plus className="w-3 h-3" />
              标记为已找到
            </button>
          )}
        </div>

        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}

        {field.type === 'boolean' ? (
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={String(field.key)}
                value="yes"
                checked={data[field.key] === true}
                onChange={() => handleFieldChange(field.key, true)}
                disabled={readOnly}
                className="w-4 h-4"
              />
              <span className="text-sm">是</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={String(field.key)}
                value="no"
                checked={data[field.key] === false}
                onChange={() => handleFieldChange(field.key, false)}
                disabled={readOnly}
                className="w-4 h-4"
              />
              <span className="text-sm">否</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={String(field.key)}
                value="unknown"
                checked={data[field.key] === undefined}
                onChange={() => handleFieldChange(field.key, undefined)}
                disabled={readOnly}
                className="w-4 h-4"
              />
              <span className="text-sm">未知</span>
            </label>
          </div>
        ) : (
          <input
            type={field.type}
            value={field.type === 'number' ? (data[field.key] as number ?? '') : String(data[field.key] ?? '')}
            onChange={(e) => {
              const value = field.type === 'number' ? 
                (e.target.value ? parseFloat(e.target.value) : undefined) :
                e.target.value;
              handleFieldChange(field.key, value);
            }}
            disabled={readOnly}
            placeholder="输入数据或留空"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              readOnly ? 'bg-gray-50 cursor-not-allowed' : ''
            } ${isMissing ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'}`}
            {...(field.maxValue && { max: field.maxValue })}
            {...(field.type === 'number' && { min: 0, step: 0.01 })}
          />
        )}
      </div>
    );
  };

  const sections = [
    {
      id: 'codeReview',
      title: '代码走查',
      fields: ['codeReviewCount', 'codeReviewScore'],
    },
    {
      id: 'codeAudit',
      title: '代码审核',
      fields: ['codeAuditCount', 'codeAuditScore'],
    },
    {
      id: 'bugReturn',
      title: 'Bug 打回率',
      fields: ['bugReturnRate', 'bugReturnRateScore'],
    },
    {
      id: 'personalBug',
      title: '个人 Bug 打回',
      fields: ['personalBugCount', 'personalBugScore'],
    },
    {
      id: 'overdue',
      title: '超期问题',
      fields: ['overdueProblemsAchieved', 'overdueProblemsScore'],
    },
    {
      id: 'design',
      title: '设计评审',
      fields: ['designReviewCount', 'designReviewScore'],
    },
    {
      id: 'total',
      title: '总分',
      fields: ['totalScore'],
    },
  ];

  return (
    <div className="space-y-4">
      {/* 缺失数据警告 */}
      {hasMissingData && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-900">检测到缺失的数据</p>
            <p className="text-sm text-yellow-700 mt-1">
              以下字段在文档中未找到，请手动输入或标记为已找到：
            </p>
            <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc">
              {missingFields.map(field => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 分组编辑区域 */}
      <div className="space-y-3">
        {sections.map(section => {
          const isExpanded = expandedSections.has(section.id);
          const sectionFields = DETAIL_FIELDS.filter(f =>
            section.fields.includes(String(f.key))
          );
          const sectionHasMissing = sectionFields.some(f =>
            f.isMissingKey && data[f.isMissingKey]
          );

          return (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                disabled={readOnly}
                className={`w-full px-4 py-3 flex items-center justify-between font-medium ${
                  sectionHasMissing
                    ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-900'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                } ${readOnly ? 'cursor-not-allowed' : 'cursor-pointer'} transition`}
              >
                <div className="flex items-center gap-2">
                  <span>{section.title}</span>
                  {sectionHasMissing && (
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                      有缺失
                    </span>
                  )}
                </div>
                <span className={`transform transition ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {isExpanded && (
                <div className="p-4 space-y-4 bg-white">
                  {sectionFields.map(field => renderField(field))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 提示信息 */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        💡 提示：黄色标记的字段表示在文档中未找到，请手动输入。输入后点击"标记为已找到"以移除警告。
      </div>
    </div>
  );
}
