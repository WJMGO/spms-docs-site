/**
 * 扩展的 LLM 服务 - 工作质量详情数据提取
 * 从文档中提取工作质量相关的详细数据，并标记缺失的字段
 */

import { ParsedDocumentData, WorkQualityDetails } from '../shared/document-parser-types';

/**
 * 调用 LLM API 的辅助函数
 */
async function invokeLLM(params: any) {
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('Missing LLM API configuration');
  }

  const response = await fetch(`${apiUrl}/llm/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 从文档中提取工作质量详情数据
 */
export async function extractWorkQualityDetails(
  documentText: string,
  employeeName?: string
): Promise<{
  data: WorkQualityDetails;
  missingFields: (keyof WorkQualityDetails)[];
  confidence: number;
}> {
  const systemPrompt = `你是一个专业的绩效数据提取专家。你的任务是从员工绩效评估文档中提取工作质量相关的详细数据。

请按照以下结构提取数据，并为每个字段标记是否找到（found: true/false）。如果文档中没有提到某个指标，请标记为 found: false。

工作质量评估包括以下维度：
1. 代码走查 - 代码走查的次数和质量评分
2. 代码审核 - 代码审核的次数和质量评分
3. Bug 打回率 - Bug 被打回的比率（百分比）和相应评分
4. 个人 Bug 有效打回 - 本人发现的有效 Bug 数量和评分
5. 超期问题部门达成 - 是否达成了超期问题解决目标
6. 设计评审 - 参与设计评审的次数和质量评分

对于每个找到的数据，提供具体的数值。对于未找到的数据，在响应中标记 found: false。`;

  const userPrompt = `请从以下文档中提取 ${employeeName || '该员工'} 的工作质量详情数据：

${documentText}

请返回 JSON 格式的响应，包含以下结构：
{
  "codeReviewCount": { "value": <数字或null>, "found": <true/false> },
  "codeReviewScore": { "value": <数字或null>, "found": <true/false> },
  "codeAuditCount": { "value": <数字或null>, "found": <true/false> },
  "codeAuditScore": { "value": <数字或null>, "found": <true/false> },
  "bugReturnRate": { "value": <数字或null>, "found": <true/false> },
  "bugReturnRateScore": { "value": <数字或null>, "found": <true/false> },
  "personalBugCount": { "value": <数字或null>, "found": <true/false> },
  "personalBugScore": { "value": <数字或null>, "found": <true/false> },
  "overdueProblemsAchieved": { "value": <true/false/null>, "found": <true/false> },
  "overdueProblemsScore": { "value": <数字或null>, "found": <true/false> },
  "designReviewCount": { "value": <数字或null>, "found": <true/false> },
  "designReviewScore": { "value": <数字或null>, "found": <true/false> },
  "totalScore": { "value": <数字或null>, "found": <true/false> },
  "confidence": <0-1之间的置信度>
}

注意：
- 所有数值应该是数字类型
- 如果未找到某个字段，将其 value 设置为 null，found 设置为 false
- 置信度应该反映提取数据的准确性（0-1）
- 对于百分比数据（如 Bug 打回率），请提供 0-100 之间的数字`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'work_quality_details',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              codeReviewCount: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              codeReviewScore: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              codeAuditCount: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              codeAuditScore: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              bugReturnRate: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              bugReturnRateScore: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              personalBugCount: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              personalBugScore: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              overdueProblemsAchieved: {
                type: 'object',
                properties: {
                  value: { type: ['boolean', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              overdueProblemsScore: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              designReviewCount: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              designReviewScore: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              totalScore: {
                type: 'object',
                properties: {
                  value: { type: ['number', 'null'] },
                  found: { type: 'boolean' },
                },
                required: ['value', 'found'],
              },
              confidence: { type: 'number' },
            },
            required: [
              'codeReviewCount',
              'codeReviewScore',
              'codeAuditCount',
              'codeAuditScore',
              'bugReturnRate',
              'bugReturnRateScore',
              'personalBugCount',
              'personalBugScore',
              'overdueProblemsAchieved',
              'overdueProblemsScore',
              'designReviewCount',
              'designReviewScore',
              'totalScore',
              'confidence',
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from LLM');
    }

    const parsed = JSON.parse(content);

    // 构建返回数据
    const workQualityDetails: WorkQualityDetails = {};
    const missingFields: (keyof WorkQualityDetails)[] = [];

    // 处理每个字段
    const fieldMappings: Array<{
      key: keyof WorkQualityDetails;
      missingKey: keyof WorkQualityDetails;
      responseKey: string;
    }> = [
      { key: 'codeReviewCount', missingKey: 'codeReviewMissing', responseKey: 'codeReviewCount' },
      { key: 'codeReviewScore', missingKey: 'codeReviewMissing', responseKey: 'codeReviewScore' },
      { key: 'codeAuditCount', missingKey: 'codeAuditMissing', responseKey: 'codeAuditCount' },
      { key: 'codeAuditScore', missingKey: 'codeAuditMissing', responseKey: 'codeAuditScore' },
      { key: 'bugReturnRate', missingKey: 'bugReturnRateMissing', responseKey: 'bugReturnRate' },
      { key: 'bugReturnRateScore', missingKey: 'bugReturnRateMissing', responseKey: 'bugReturnRateScore' },
      { key: 'personalBugCount', missingKey: 'personalBugMissing', responseKey: 'personalBugCount' },
      { key: 'personalBugScore', missingKey: 'personalBugMissing', responseKey: 'personalBugScore' },
      { key: 'overdueProblemsAchieved', missingKey: 'overdueProblemsMissing', responseKey: 'overdueProblemsAchieved' },
      { key: 'overdueProblemsScore', missingKey: 'overdueProblemsMissing', responseKey: 'overdueProblemsScore' },
      { key: 'designReviewCount', missingKey: 'designReviewMissing', responseKey: 'designReviewCount' },
      { key: 'designReviewScore', missingKey: 'designReviewMissing', responseKey: 'designReviewScore' },
      { key: 'totalScore', missingKey: 'totalScore', responseKey: 'totalScore' },
    ];

    for (const mapping of fieldMappings) {
      const fieldData = parsed[mapping.responseKey];
      if (fieldData && fieldData.value !== null && fieldData.found) {
        workQualityDetails[mapping.key] = fieldData.value;
      } else if (fieldData && !fieldData.found) {
        // 标记为缺失
        if (mapping.missingKey.includes('Missing')) {
          (workQualityDetails[mapping.missingKey as keyof WorkQualityDetails] as any) = true;
        }
        missingFields.push(mapping.key);
      }
    }

    return {
      data: workQualityDetails,
      missingFields,
      confidence: parsed.confidence || 0.8,
    };
  } catch (error) {
    console.error('Failed to extract work quality details:', error);
    throw error;
  }
}

/**
 * 合并工作质量详情到解析数据中
 */
export function mergeWorkQualityDetails(
  parsedData: ParsedDocumentData,
  workQualityDetails: WorkQualityDetails
): ParsedDocumentData {
  return {
    ...parsedData,
    workQualityDetails,
  };
}

/**
 * 验证工作质量详情数据的有效性
 */
export function validateWorkQualityDetails(
  details: WorkQualityDetails
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 验证数值范围
  const numericFields = [
    { key: 'codeReviewCount', min: 0, max: 1000 },
    { key: 'codeReviewScore', min: 0, max: 100 },
    { key: 'codeAuditCount', min: 0, max: 1000 },
    { key: 'codeAuditScore', min: 0, max: 100 },
    { key: 'bugReturnRate', min: 0, max: 100 },
    { key: 'bugReturnRateScore', min: 0, max: 100 },
    { key: 'personalBugCount', min: 0, max: 1000 },
    { key: 'personalBugScore', min: 0, max: 100 },
    { key: 'overdueProblemsScore', min: 0, max: 100 },
    { key: 'designReviewCount', min: 0, max: 1000 },
    { key: 'designReviewScore', min: 0, max: 100 },
    { key: 'totalScore', min: 0, max: 100 },
  ];

  for (const field of numericFields) {
    const value = details[field.key as keyof WorkQualityDetails] as number | undefined;
    if (value !== undefined) {
      if (value < field.min || value > field.max) {
        errors.push(`${field.key} 值 ${value} 超出范围 [${field.min}, ${field.max}]`);
      }
    }
  }

  // 检查缺失标记
  const missingFields = [
    'codeReviewMissing',
    'codeAuditMissing',
    'bugReturnRateMissing',
    'personalBugMissing',
    'overdueProblemsMissing',
    'designReviewMissing',
  ];

  const hasMissing = missingFields.some(
    field => details[field as keyof WorkQualityDetails] === true
  );

  if (hasMissing) {
    warnings.push('存在标记为缺失的字段，请确保在使用前补充完整');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
