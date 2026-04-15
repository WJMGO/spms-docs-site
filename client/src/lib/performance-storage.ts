import { PeriodPerformanceData } from '../../../shared/assessment-periods';

/**
 * 本地存储键名
 */
const STORAGE_KEY_PREFIX = 'performance_registration_';

/**
 * 暂存绩效数据到本地存储
 * @param periodId 周期 ID
 * @param data 绩效数据
 */
export function savePerformanceDataToStorage(periodId: string, data: PeriodPerformanceData): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}${periodId}`;
    const storageData = {
      ...data,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error) {
    console.error('Failed to save performance data to storage:', error);
    throw new Error('暂存数据失败，请检查浏览器存储空间');
  }
}

/**
 * 从本地存储读取绩效数据
 * @param periodId 周期 ID
 * @returns 绩效数据，如果不存在则返回 null
 */
export function getPerformanceDataFromStorage(periodId: string): (PeriodPerformanceData & { savedAt: string }) | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${periodId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get performance data from storage:', error);
    return null;
  }
}

/**
 * 清除本地存储的绩效数据
 * @param periodId 周期 ID
 */
export function clearPerformanceDataFromStorage(periodId: string): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}${periodId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear performance data from storage:', error);
  }
}

/**
 * 检查是否存在暂存数据
 * @param periodId 周期 ID
 * @returns 是否存在暂存数据
 */
export function hasStoredPerformanceData(periodId: string): boolean {
  try {
    const key = `${STORAGE_KEY_PREFIX}${periodId}`;
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error('Failed to check stored performance data:', error);
    return false;
  }
}

/**
 * 导出绩效数据为 Excel
 * @param data 绩效数据
 * @param periodName 周期名称
 */
export async function exportPerformanceDataToExcel(
  data: PeriodPerformanceData,
  periodName: string,
  employeeName: string = '员工'
): Promise<void> {
  try {
    // 动态导入 xlsx 库
    const XLSX = await import('xlsx');

    // 创建工作簿
    const workbook = XLSX.utils.book_new();

    // 1. 创建摘要工作表
    const summaryData = [
      ['绩效登记数据导出'],
      [''],
      ['基本信息'],
      ['员工名称', employeeName],
      ['评估周期', periodName],
      ['导出时间', new Date().toLocaleString('zh-CN')],
      [''],
      ['分数汇总'],
      ['目标完成分', data.objectives.reduce((sum, obj) => sum + obj.score, 0)],
      ['加分项总分', data.bonusItems.reduce((sum, item) => sum + item.score, 0)],
      ['扣分项总分', data.penaltyItems.reduce((sum, item) => sum + item.score, 0)],
      ['最终总分', 
        data.objectives.reduce((sum, obj) => sum + obj.score, 0) +
        data.bonusItems.reduce((sum, item) => sum + item.score, 0) +
        data.penaltyItems.reduce((sum, item) => sum + item.score, 0)
      ],
      ['预测分数', data.forecastScore],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, '摘要');

    // 2. 创建个人月度目标工作表
    const objectivesData = [
      ['考核维度', '月度目标', '关键结果', '截止日期', '完成状态', '直评分数'],
      ...data.objectives.map((obj) => [
        obj.type,
        obj.objective,
        obj.keyResult,
        obj.dueDate,
        obj.status,
        obj.score,
      ]),
    ];
    const objectivesSheet = XLSX.utils.aoa_to_sheet(objectivesData);
    XLSX.utils.book_append_sheet(workbook, objectivesSheet, '个人月度目标');

    // 3. 创建工作质量数据工作表
    const qualityData = [
      ['指标名称', '代码', '数值', '说明'],
      ...data.qualityMetrics.map((metric) => [
        metric.name,
        metric.code,
        metric.value,
        metric.label,
      ]),
    ];
    const qualitySheet = XLSX.utils.aoa_to_sheet(qualityData);
    XLSX.utils.book_append_sheet(workbook, qualitySheet, '工作质量数据');

    // 4. 创建绩效加分项工作表
    const bonusData = [
      ['项目名称', '描述', '分数'],
      ...data.bonusItems.map((item) => [
        item.name,
        item.description,
        item.score,
      ]),
    ];
    const bonusSheet = XLSX.utils.aoa_to_sheet(bonusData);
    XLSX.utils.book_append_sheet(workbook, bonusSheet, '绩效加分项');

    // 5. 创建绩效扣分项工作表
    const penaltyData = [
      ['项目名称', '描述', '分数'],
      ...data.penaltyItems.map((item) => [
        item.name,
        item.description,
        item.score,
      ]),
    ];
    const penaltySheet = XLSX.utils.aoa_to_sheet(penaltyData);
    XLSX.utils.book_append_sheet(workbook, penaltySheet, '绩效扣分项');

    // 导出文件
    const fileName = `绩效登记数据_${employeeName}_${periodName}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('Failed to export performance data to Excel:', error);
    throw new Error('导出 Excel 失败，请检查网络连接');
  }
}
