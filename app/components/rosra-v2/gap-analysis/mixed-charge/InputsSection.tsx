import { useMixedCharge } from '@/app/context/MixedChargeContext';
import { MixedChargeData } from '@/app/types/mixed-charge-analysis';

interface InputFieldProps {
  label: string;
  sublabel?: string;
  name: keyof MixedChargeData;
  value: number;
  onChange: (name: string, value: number) => void;
  step?: number;
}

function InputField({ label, sublabel, name, value, onChange, step = 1 }: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-base font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      {sublabel && (
        <span className="block text-sm text-gray-600 dark:text-gray-400">
          {sublabel}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        name={name}
        step={step}
        className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

export function InputsSection() {
  const { data, updateData } = useMixedCharge();

  const handleInputChange = (name: string, value: number) => {
    updateData({
      ...data,
      [name]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Daily Users Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Users
        </h3>
        <div className="space-y-4">
          <InputField
            label="Estimated Users"
            sublabel="Users"
            name="estimatedDailyUsers"
            value={data.estimatedDailyUsers}
            onChange={handleInputChange}
          />
          <InputField
            label="Actual Users"
            sublabel="Users"
            name="actualDailyUsers"
            value={data.actualDailyUsers}
            onChange={handleInputChange}
          />
          <InputField
            label="Average Fee"
            sublabel="Fee"
            name="averageDailyUserFee"
            value={data.averageDailyUserFee}
            onChange={handleInputChange}
            step={0.1}
          />
          <InputField
            label="Actual Fee"
            sublabel="Fee"
            name="actualDailyUserFee"
            value={data.actualDailyUserFee}
            onChange={handleInputChange}
            step={0.1}
          />
        </div>
      </div>

      {/* Monthly Users Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Monthly Users
        </h3>
        <div className="space-y-4">
          <InputField
            label="Available Users"
            sublabel="Users"
            name="availableMonthlyUsers"
            value={data.availableMonthlyUsers}
            onChange={handleInputChange}
          />
          <InputField
            label="Paying Users"
            sublabel="Users"
            name="payingMonthlyUsers"
            value={data.payingMonthlyUsers}
            onChange={handleInputChange}
          />
          <InputField
            label="Average Rate"
            sublabel="Rate"
            name="averageMonthlyRate"
            value={data.averageMonthlyRate}
            onChange={handleInputChange}
          />
          <InputField
            label="Actual Rate"
            sublabel="Rate"
            name="actualMonthlyRate"
            value={data.actualMonthlyRate}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
}
