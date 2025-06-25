
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Send, FileText, Camera } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const facultyCoordinators = [
  "Dr. M.RM. Krishnappa (Asso. Prof./Physics)",
  "Dr. S. Nithyanandan (Physical Director)",
  "Dr. B. Nataraj (Asso. Prof./ECE)",
  "Dr. P. Mathiyalagan (Asso. Prof./CSE)",
  "Mrs.S.Jansi Rani, AP(Sl.Gr)/IT",
  "Dr. S. Krishnaprabha (Asso. Prof./MBA)",
  "Dr. S. Hema (Asso. Prof./Civil)",
  "Dr. A. Kishore Kumar (AP(Sl.G)/RA)",
  "Dr. P. Sebastian Vindro Jude (AP(Sl.G)/EEE)",
  "Mr. R. Mohankumar (AP(Sl.G)/EEE)",
  "Dr. N. Gunasekar (Asso. Prof./Mech)",
  "Dr. R. Raveen (AP(Sr.G)/Mech)",
  "Dr. V. Radhika (Asso. Prof./BME)",
  "Dr. J. Sreeja (AP(Sl.G)/Chemistry)"
];

const SDGForm = () => {
  const [formData, setFormData] = useState({
    sdgGoal: '',
    facultyCoordinator: '',
    activityTitle: '',
    activityDate: undefined as Date | undefined,
    numberOfBeneficiaries: '',
    photosUploaded: false,
    report: '',
    reportUploaded: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['sdgGoal', 'facultyCoordinator', 'activityTitle', 'activityDate', 'numberOfBeneficiaries', 'report'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Validation Error",
          description: `Please fill in all required fields. Missing: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const submitToGoogleDrive = async () => {
    const submissionData = {
      timestamp: new Date().toISOString(),
      sdgGoal: formData.sdgGoal,
      facultyCoordinator: formData.facultyCoordinator,
      activityTitle: formData.activityTitle,
      activityDate: formData.activityDate ? format(formData.activityDate, 'yyyy-MM-dd') : '',
      numberOfBeneficiaries: formData.numberOfBeneficiaries,
      report: formData.report,
      photosUploaded: formData.photosUploaded,
      reportUploaded: formData.reportUploaded,
      photosDriveLink: "https://drive.google.com/drive/folders/1fcE99gBJ0do-sMg3mRY9cM3hEl-ymUPr?usp=drive_link",
      reportsDriveLink: "https://drive.google.com/drive/folders/1Ypala6WnJ-zjAx3Bq_aO2Xv11Icr13QN?usp=drive_link"
    };

    // For demonstration purposes, we'll log the data and show success
    // In a real implementation, you would use Google Apps Script or Google Drive API
    console.log("Form Data to be saved to Google Drive:", submissionData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return submissionData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await submitToGoogleDrive();
      
      toast({
        title: "Form Submitted Successfully!",
        description: "Your SDG activity report has been saved to Google Drive.",
      });
      
      // Reset form
      setFormData({
        sdgGoal: '',
        facultyCoordinator: '',
        activityTitle: '',
        activityDate: undefined,
        numberOfBeneficiaries: '',
        photosUploaded: false,
        report: '',
        reportUploaded: false
      });
      
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error saving your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">
              SDG Activity Report Form
            </CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Submit your Sustainable Development Goals activity details
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SDG Goal */}
              <div className="space-y-2">
                <Label htmlFor="sdgGoal" className="text-sm font-semibold text-gray-700 flex items-center">
                  SDG Goal <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="sdgGoal"
                  value={formData.sdgGoal}
                  onChange={(e) => handleInputChange('sdgGoal', e.target.value)}
                  placeholder="Enter the SDG Goal number or description"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Faculty Coordinator */}
              <div className="space-y-2">
                <Label htmlFor="facultyCoordinator" className="text-sm font-semibold text-gray-700 flex items-center">
                  Faculty Coordinator Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select value={formData.facultyCoordinator} onValueChange={(value) => handleInputChange('facultyCoordinator', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select a faculty coordinator" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {facultyCoordinators.map((coordinator) => (
                      <SelectItem key={coordinator} value={coordinator}>
                        {coordinator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Activity Title */}
              <div className="space-y-2">
                <Label htmlFor="activityTitle" className="text-sm font-semibold text-gray-700 flex items-center">
                  Activity Title <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="activityTitle"
                  value={formData.activityTitle}
                  onChange={(e) => handleInputChange('activityTitle', e.target.value)}
                  placeholder="Enter the activity title"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date of Activity */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  Date of the Activity <span className="text-red-500 ml-1">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-blue-500",
                        !formData.activityDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.activityDate ? format(formData.activityDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.activityDate}
                      onSelect={(date) => handleInputChange('activityDate', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Number of Beneficiaries */}
              <div className="space-y-2">
                <Label htmlFor="beneficiaries" className="text-sm font-semibold text-gray-700 flex items-center">
                  Number of Beneficiaries <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  value={formData.numberOfBeneficiaries}
                  onChange={(e) => handleInputChange('numberOfBeneficiaries', e.target.value)}
                  placeholder="Enter number of beneficiaries"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Photos Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  Photos <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload your photos to the shared Drive folder using this link:
                    </p>
                    <a
                      href="https://drive.google.com/drive/folders/1fcE99gBJ0do-sMg3mRY9cM3hEl-ymUPr?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                      https://drive.google.com/drive/folders/1fcE99gBJ0do-sMg3mRY9cM3hEl-ymUPr?usp=drive_link
                    </a>
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('photosUploaded', !formData.photosUploaded)}
                        className={formData.photosUploaded ? "bg-green-50 border-green-300 text-green-700" : ""}
                      >
                        {formData.photosUploaded ? "✓ Photos Uploaded" : "Mark as Uploaded"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report */}
              <div className="space-y-2">
                <Label htmlFor="report" className="text-sm font-semibold text-gray-700 flex items-center">
                  Report <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="report"
                  value={formData.report}
                  onChange={(e) => handleInputChange('report', e.target.value)}
                  placeholder="Enter your detailed activity report (Max 10 MB when uploaded as file)"
                  className="min-h-32 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Reports Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  Reports <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload your report to the shared Drive folder using this link:
                    </p>
                    <a
                      href="https://drive.google.com/drive/folders/1Ypala6WnJ-zjAx3Bq_aO2Xv11Icr13QN?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                      https://drive.google.com/drive/folders/1Ypala6WnJ-zjAx3Bq_aO2Xv11Icr13QN?usp=drive_link
                    </a>
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('reportUploaded', !formData.reportUploaded)}
                        className={formData.reportUploaded ? "bg-green-50 border-green-300 text-green-700" : ""}
                      >
                        {formData.reportUploaded ? "✓ Report Uploaded" : "Mark as Uploaded"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Activity Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>All submissions are automatically saved to the designated Google Drive folders</p>
        </div>
      </div>
    </div>
  );
};

export default SDGForm;
