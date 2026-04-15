import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssessmentPeriod, ASSESSMENT_PERIODS } from "../../../shared/assessment-periods";

interface PeriodSelectorProps {
  selectedPeriod: AssessmentPeriod;
  onPeriodChange: (period: AssessmentPeriod) => void;
}

export default function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
}: PeriodSelectorProps) {
  const currentIndex = ASSESSMENT_PERIODS.findIndex(
    (p: AssessmentPeriod) => p.id === selectedPeriod.id
  );

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onPeriodChange(ASSESSMENT_PERIODS[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < ASSESSMENT_PERIODS.length - 1) {
      onPeriodChange(ASSESSMENT_PERIODS[currentIndex + 1]);
    }
  };

  const handleSelectChange = (periodId: string) => {
    const period = ASSESSMENT_PERIODS.find((p: AssessmentPeriod) => p.id === periodId);
    if (period) {
      onPeriodChange(period);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "closed":
        return "bg-yellow-100 text-yellow-700";
      case "published":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "进行中";
      case "closed":
        return "已关闭";
      case "published":
        return "已发布";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between gap-4">
        {/* 左侧导航按钮 */}
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          上个月
        </Button>

        {/* 中间信息展示 */}
        <div className="flex-1">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">当前评分周期</p>
              <div className="flex items-center gap-3 justify-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedPeriod.year}年{selectedPeriod.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                    selectedPeriod.status
                  )}`}
                >
                  {getStatusLabel(selectedPeriod.status)}
                </span>
              </div>
            </div>

            {/* 竖线分隔 */}
            <div className="h-12 w-px bg-slate-200"></div>

            {/* 日期范围 */}
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">考核周期</p>
              <p className="text-sm font-medium text-slate-900">
                {selectedPeriod.startDate} 至 {selectedPeriod.endDate}
              </p>
            </div>
          </div>
        </div>

        {/* 右侧导航按钮 */}
        <Button
          onClick={handleNext}
          disabled={currentIndex === ASSESSMENT_PERIODS.length - 1}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          下个月
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* 下拉选择器 */}
      <div className="mt-6 flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">
          快速选择月份:
        </label>
        <Select value={selectedPeriod.id} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="选择评分周期" />
          </SelectTrigger>
          <SelectContent>
            {ASSESSMENT_PERIODS.map((period: AssessmentPeriod) => (
              <SelectItem key={period.id} value={period.id}>
                <div className="flex items-center gap-2">
                  <span>
                    {period.year}年{period.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({getStatusLabel(period.status)})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 当前周期指示 */}
        {selectedPeriod.isCurrentPeriod && (
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-600 font-medium">当前周期</span>
          </div>
        )}
      </div>
    </div>
  );
}
