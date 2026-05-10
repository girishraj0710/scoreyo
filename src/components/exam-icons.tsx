// Professional exam icons using Lucide icons (contextually appropriate)

import { getExamIcon } from "@/lib/professional-icons";

export const ExamIcon = ({
  examId,
  className = "w-8 h-8",
  color
}: {
  examId: string;
  className?: string;
  color?: string;
}) => {
  const Icon = getExamIcon(examId);

  return (
    <Icon
      className={className}
      style={color ? { color } : undefined}
    />
  );
};
