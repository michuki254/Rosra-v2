interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  color: 'blue' | 'emerald' | 'red' | 'orange' | 'gray' | 'yellow';
}

const colorMap = {
  blue: 'border-blue-500 dark:border-blue-500/50',
  emerald: 'border-emerald-500 dark:border-emerald-500/50',
  red: 'border-red-500 dark:border-red-500/50',
  orange: 'border-orange-500 dark:border-orange-500/50',
  gray: 'border-gray-500 dark:border-gray-500/50',
  yellow: 'border-yellow-500 dark:border-yellow-500/50',
};

const textColorMap = {
  blue: 'text-blue-600 dark:text-blue-400',
  emerald: 'text-emerald-600 dark:text-emerald-400',
  red: 'text-red-600 dark:text-red-400',
  orange: 'text-orange-600 dark:text-orange-400',
  gray: 'text-gray-600 dark:text-gray-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
};

export const MetricCard = ({ title, value, description, color }: MetricCardProps) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 border-l-4 ${colorMap[color]}`}>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">{title}</div>
      <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
        {value}
      </div>
      <div className={`text-sm ${textColorMap[color]}`}>
        {description}
      </div>
    </div>
  );
};
