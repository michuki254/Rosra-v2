import React, { useState, useEffect } from 'react';
import { useMixedChargeData } from '@/app/hooks/useMixedChargeData';
import { MixedChargeData, MixedChargeMetrics, MixedChargeCompleteData } from '@/app/types/mixed-charge-analysis';
import { DailyUserChargeForm } from './DailyUserChargeForm';
import { MonthlyUserChargeForm } from './MonthlyUserChargeForm';
import { MixedChargeGapAnalysis } from './MixedChargeGapAnalysis';
import { MixedChargeMetricsDisplay } from './MixedChargeMetricsDisplay';
import { MixedChargeChartDisplay } from './MixedChargeChartDisplay';
import { MixedChargeRevenueAnalysis } from './MixedChargeRevenueAnalysis';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useToast } from '@/app/hooks/useToast';
import { Button } from '@/app/components/ui/button';
import { SaveIcon, RefreshCcw } from 'lucide-react';
import { MixedChargeAnalysisService } from '@/app/services/mixed-charge-analysis.service';

interface MixedUserChargeAnalysisProps {
  onMetricsChange?: (metrics: any) => void;
  reportId?: string;
  initialData?: any;
}

export default function MixedUserChargeAnalysis({
  onMetricsChange,
  reportId,
  initialData
}: MixedUserChargeAnalysisProps) {
  const { toast } = useToast();
  const { data, loading: dataLoading, error, isSaving, loadData, saveData } = useMixedChargeData(reportId);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<MixedChargeMetrics>({
    actual: 0,
    potential: 0,
    gap: 0,
    gapBreakdown: {
      complianceGap: 0,
      rateGap: 0,
      combinedGaps: 0,
      registrationGapPercentage: 0
    }
  });
  
  const [formData, setFormData] = useState<MixedChargeData>({
    estimatedDailyUsers: 0,
    actualDailyUsers: 0,
    averageDailyUserFee: 0,
    actualDailyUserFee: 0,
    availableMonthlyUsers: 0,
    payingMonthlyUsers: 0,
    averageMonthlyRate: 0,
    actualMonthlyRate: 0
  });

  // Initialize with initial data if available
  useEffect(() => {
    if (initialData && initialData.data) {
      const processedData = MixedChargeAnalysisService.processInputData(initialData.data);
      setFormData(processedData);
      
      if (initialData.metrics) {
        setMetrics(initialData.metrics);
      }
    }
  }, [initialData]);

  // Update metrics when data changes
  useEffect(() => {
    const calculatedMetrics = MixedChargeAnalysisService.calculateMetrics(formData);
    setMetrics(calculatedMetrics);
  }, [formData]);

  // Update parent component with metrics when they change
  useEffect(() => {
    if (onMetricsChange) {
      console.log('Nested MixedUserChargeAnalysis - Sending metrics to parent:', metrics);
      console.log('Nested MixedUserChargeAnalysis - Sending data to parent:', formData);
      
      // Create a properly formatted data object with default values for all fields
      const formattedData = {
        metrics: {
          actual: metrics.actual || 0,
          potential: metrics.potential || 0,
          gap: metrics.gap || 0,
          gapBreakdown: {
            complianceGap: metrics.gapBreakdown?.complianceGap || 0,
            rateGap: metrics.gapBreakdown?.rateGap || 0,
            combinedGaps: metrics.gapBreakdown?.combinedGaps || 0
          }
        },
        data: {
          estimatedDailyUsers: formData.estimatedDailyUsers || 0,
          actualDailyUsers: formData.actualDailyUsers || 0,
          averageDailyUserFee: formData.averageDailyUserFee || 0,
          actualDailyUserFee: formData.actualDailyUserFee || 0,
          availableMonthlyUsers: formData.availableMonthlyUsers || 0,
          payingMonthlyUsers: formData.payingMonthlyUsers || 0,
          averageMonthlyRate: formData.averageMonthlyRate || 0,
          actualMonthlyRate: formData.actualMonthlyRate || 0
        }
      };
      
      console.log('Nested MixedUserChargeAnalysis - Formatted data for parent:', formattedData);
      onMetricsChange(formattedData);
    }
  }, [metrics, formData, onMetricsChange]);

  // Load data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (reportId && !initialData) {
        try {
          setIsLoading(true);
          const loadedData = await loadData();
          
          if (loadedData) {
            // Process the data using the MixedChargeAnalysisService
            if (loadedData.data) {
              const processedData = MixedChargeAnalysisService.processInputData(loadedData.data);
              setFormData(processedData);
            }
            
            if (loadedData.metrics) {
              setMetrics(loadedData.metrics);
            }
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load mixed charge data",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [reportId, loadData, toast, initialData]);

  // Handle saving data
  const handleSaveData = async () => {
    if (!reportId) {
      toast({
        title: "Error",
        description: "Report ID is required to save data",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare data to save
      const dataToSave = {
        metrics: {
          actual: metrics.actual,
          potential: metrics.potential,
          gap: metrics.gap,
          gapBreakdown: {
            complianceGap: metrics.gapBreakdown.complianceGap,
            rateGap: metrics.gapBreakdown.rateGap,
            combinedGaps: metrics.gapBreakdown.combinedGaps
          }
        },
        data: {
          estimatedDailyUsers: formData.estimatedDailyUsers,
          actualDailyUsers: formData.actualDailyUsers,
          averageDailyUserFee: formData.averageDailyUserFee,
          actualDailyUserFee: formData.actualDailyUserFee,
          availableMonthlyUsers: formData.availableMonthlyUsers,
          payingMonthlyUsers: formData.payingMonthlyUsers,
          averageMonthlyRate: formData.averageMonthlyRate,
          actualMonthlyRate: formData.actualMonthlyRate
        }
      };
      
      const success = await saveData(dataToSave);
      
      if (success) {
        toast({
          title: "Success",
          description: "Mixed charge data saved successfully",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save mixed charge data",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form data changes
  const handleFormDataChange = (newData: Partial<MixedChargeData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mixed User Charge Analysis</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => loadData()}
            disabled={isLoading || dataLoading}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSaveData}
            disabled={isLoading || isSaving}
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Tabs defaultValue="forms">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forms">Data Entry</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <DailyUserChargeForm 
                  data={formData} 
                  onChange={handleFormDataChange} 
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <MonthlyUserChargeForm 
                  data={formData} 
                  onChange={handleFormDataChange} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics">
          <Card>
            <CardContent className="pt-6">
              <MixedChargeMetricsDisplay metrics={metrics} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="charts">
          <Card>
            <CardContent className="pt-6">
              <MixedChargeChartDisplay data={formData} metrics={metrics} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <MixedChargeGapAnalysis metrics={metrics} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <MixedChargeRevenueAnalysis data={formData} metrics={metrics} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
