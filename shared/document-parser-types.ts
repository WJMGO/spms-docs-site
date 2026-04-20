/**
 * 文档解析相关的共享类型定义
 */

/**
 * 从文档中提取的原始数据
 */
export interface ParsedDocumentData {
  // 员工基本信息
  employeeName?: string;
  employeeId?: string;
  department?: string;
  position?: string;

  // 绩效评分数据（6个维度）
  dailyWorkScore?: number;
  workQualityScore?: number;
  personalGoalScore?: number;
  departmentReviewScore?: number;
  bonusScore?: number;
  penaltyScore?: number;

  // 总分和排名
  totalScore?: number;
  rank?: number;

  // 评价和备注
  comments?: string;
  evaluatorName?: string;
  evaluationDate?: string;

  // 工作质量详情数据
  workQualityDetails?: WorkQualityDetails;

  // 其他信息
  rawText?: string; // 原始提取的文本内容
  extractionConfidence?: number; // 提取置信度 0-1
}

/**
 * 工作质量详情数据
 */
export interface WorkQualityDetails {
  // 代码走查
  codeReviewCount?: number;
  codeReviewScore?: number;
  codeReviewMissing?: boolean;

  // 代码审核
  codeAuditCount?: number;
  codeAuditScore?: number;
  codeAuditMissing?: boolean;

  // Bug 打回率
  bugReturnRate?: number;
  bugReturnRateScore?: number;
  bugReturnRateMissing?: boolean;

  // 个人 Bug 有效打回
  personalBugCount?: number;
  personalBugScore?: number;
  personalBugMissing?: boolean;

  // 超期问题部门达成
  overdueProblemsAchieved?: boolean;
  overdueProblemsScore?: number;
  overdueProblemsMissing?: boolean;

  // 设计评审
  designReviewCount?: number;
  designReviewScore?: number;
  designReviewMissing?: boolean;

  // 总分
  totalScore?: number;
}

/**
 * 文档上传和解析请求
 */
export interface DocumentParseRequest {
  fileName: string;
  fileContent: string; // Base64 编码的文件内容
  mimeType: string;
  periodId?: string; // 评估周期 ID
  templateId?: string; // 评分模板 ID
}

/**
 * 文档解析响应
 */
export interface DocumentParseResponse {
  success: boolean;
  data?: ParsedDocumentData;
  error?: string;
  warnings?: string[];
  fileUrl?: string; // S3 上传后的文件 URL
  fileKey?: string; // S3 文件 key
}

/**
 * 解析结果确认请求
 */
export interface ParseResultConfirmRequest {
  parsedData: ParsedDocumentData;
  employeeId: string;
  periodId: string;
  templateId: string;
  evaluatorId: string;
  adjustments?: Partial<ParsedDocumentData>; // 用户调整的数据
}

/**
 * 解析结果确认响应
 */
export interface ParseResultConfirmResponse {
  success: boolean;
  assessmentId?: string;
  message?: string;
  error?: string;
}

/**
 * 批量文档解析请求
 */
export interface BatchDocumentParseRequest {
  documents: DocumentParseRequest[];
  periodId?: string;
  templateId?: string;
}

/**
 * 批量文档解析响应
 */
export interface BatchDocumentParseResponse {
  success: boolean;
  results: DocumentParseResponse[];
  successCount: number;
  failureCount: number;
}
