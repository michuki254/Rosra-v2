import React from 'react';
import { MixedChargeData } from '@/app/types/mixed-charge-analysis';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface MonthlyUserChargeFormProps {
  data: MixedChargeData;
  onChange: (data: Partial<MixedChargeData>) => void;
}

export const MonthlyUserChargeForm: React.FC<MonthlyUserChargeFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: Number(value) });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Monthly User Charges</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="availableMonthlyUsers">Available Monthly Users</Label>
          <Input
            id="availableMonthlyUsers"
            name="availableMonthlyUsers"
            type="number"
            value={data.availableMonthlyUsers}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="payingMonthlyUsers">Paying Monthly Users</Label>
          <Input
            id="payingMonthlyUsers"
            name="payingMonthlyUsers"
            type="number"
            value={data.payingMonthlyUsers}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="averageMonthlyRate">Average Monthly Rate</Label>
          <Input
            id="averageMonthlyRate"
            name="averageMonthlyRate"
            type="number"
            value={data.averageMonthlyRate}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="actualMonthlyRate">Actual Monthly Rate</Label>
          <Input
            id="actualMonthlyRate"
            name="actualMonthlyRate"
            type="number"
            value={data.actualMonthlyRate}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
