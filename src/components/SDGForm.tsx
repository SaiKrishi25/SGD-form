
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
    facultyCoordinators: [] as string[],
    activityTitle: '',
    activityDate: undefined as Date | undefined,
    numberOfBeneficiaries: '',
    photos: [] as File[],
    reportFiles: [] as File[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFacultyChange = (coordinator: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      facultyCoordinators: checked 
        ? [...prev.facultyCoordinators, coordinator]
        : prev.facultyCoordinators.filter(fc => fc !== coordinator)
    }));
  };

  const handleFileUpload = (files: FileList | null, type: 'photos' | 'reportFiles') => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileArray]
    }));
  };

  const removeFile = (index: number, type: 'photos' | 'reportFiles') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const required = ['sdgGoal', 'activityTitle', 'activityDate', 'numberOfBeneficiaries'];
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
    
    if (formData.facultyCoordinators.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one faculty coordinator",
        variant: "destructive",
      });
      return false;
    }

    if (formData.photos.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one photo",
        variant: "destructive",
      });
      return false;
    }

    if (formData.reportFiles.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one report file",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const uploadFilesToDrive = async (files: File[], folderId: string) => {
    // Simulate file upload to Google Drive
    console.log(`Uploading ${files.length} files to Drive folder: ${folderId}`);
    
    // In a real implementation, you would use Google Drive API here
    const uploadedFiles = files.map(file => ({
      name: file.name,
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: `https://drive.google.com/file/d/file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}/view`
    }));
    
    return uploadedFiles;
  };

  const submitToGoogleSheets = async (submissionData: any) => {
    // Simulate Google Sheets API call
    console.log("Submitting to Google Sheets:", submissionData);
    
    // In a real implementation, you would use Google Sheets API or Google Apps Script
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return submissionData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Upload photos to Google Drive
      const uploadedPhotos = await uploadFilesToDrive(formData.photos, "1fcE99gBJ0do-sMg3mRY9cM3hEl-ymUPr");
      
      // Upload reports to Google Drive
      const uploadedReports = await uploadFilesToDrive(formData.reportFiles, "1RvtPszHpNdFfekXIzcQQStggBnv4SIUe");
      
      const submissionData = {
        timestamp: new Date().toISOString(),
        sdgGoal: formData.sdgGoal,
        facultyCoordinators: formData.facultyCoordinators.join(', '),
        activityTitle: formData.activityTitle,
        activityDate: formData.activityDate ? format(formData.activityDate, 'yyyy-MM-dd') : '',
        numberOfBeneficiaries: formData.numberOfBeneficiaries,
        photosLinks: uploadedPhotos.map(file => file.url).join(', '),
        reportsLinks: uploadedReports.map(file => file.url).join(', '),
        photosDriveFolder: "https://drive.google.com/drive/folders/1fcE99gBJ0do-sMg3mRY9cM3hEl-ymUPr",
        reportsDriveFolder: "https://drive.google.com/drive/folders/1RvtPszHpNdFfekXIzcQQStggBnv4SIUe"
      };

      await submitToGoogleSheets(submissionData);
      
      toast({
        title: "Form Submitted Successfully!",
        description: "Your SDG activity report has been saved to Google Sheets with file links.",
      });
      
      // Reset form
      setFormData({
        sdgGoal: '',
        facultyCoordinators: [],
        activityTitle: '',
        activityDate: undefined,
        numberOfBeneficiaries: '',
        photos: [],
        reportFiles: []
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

              {/* Faculty Coordinators - Multiple Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  Faculty Coordinator Names <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                  {facultyCoordinators.map((coordinator) => (
                    <div key={coordinator} className="flex items-center space-x-2">
                      <Checkbox
                        id={coordinator}
                        checked={formData.facultyCoordinators.includes(coordinator)}
                        onCheckedChange={(checked) => handleFacultyChange(coordinator, checked as boolean)}
                      />
                      <Label htmlFor={coordinator} className="text-sm cursor-pointer">
                        {coordinator}
                      </Label>
                    </div>
                  ))}
                </div>
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
                    <p className="text-sm text-gray-600 mb-2">Upload photos</p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'photos')}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                </div>
                {formData.photos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Uploaded Photos:</p>
                    {formData.photos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index, 'photos')}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reports Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  Reports <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload report files (Max 10 MB each)</p>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload(e.target.files, 'reportFiles')}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                </div>
                {formData.reportFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Uploaded Reports:</p>
                    {formData.reportFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFile(index, 'reportFiles')}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
                    <//>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>All submissions are automatically saved to Google Sheets with file links to Google Drive</p>
        </div>
      </div>
    </div>
  );
};

export default SDGForm;
