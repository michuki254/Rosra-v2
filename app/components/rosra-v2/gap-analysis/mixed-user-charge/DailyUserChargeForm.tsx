import React from 'react';
import { MixedChargeData } from '@/app/types/mixed-charge-analysis';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface DailyUserChargeFormProps {
  data: MixedChargeData;
  onChange: (data: Partial<MixedChargeData>) => void;
}

export const DailyUserChargeForm: React.FC<DailyUserChargeFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: Number(value) });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Daily User Charges</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimatedDailyUsers">Estimated Daily Users</Label>
          <Input
            id="estimatedDailyUsers"
            name="estimatedDailyUsers"
            type="number"
            value={data.estimatedDailyUsers}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="actualDailyUsers">Actual Daily Users</Label>
          <Input
            id="actualDailyUsers"
            name="actualDailyUsers"
            type="number"
            value={data.actualDailyUsers}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="averageDailyUserFee">Average Daily User Fee</Label>
          <Input
            id="averageDailyUserFee"
            name="averageDailyUserFee"
            type="number"
            value={data.averageDailyUserFee}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="actualDailyUserFee">Actual Daily User Fee</Label>
          <Input
            id="actualDailyUserFee"
            name="actualDailyUserFee"
            type="number"
            value={data.actualDailyUserFee}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
