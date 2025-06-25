
export interface FormSubmission {
  timestamp: string;
  sdgGoal: string;
  facultyCoordinators: string;
  activityTitle: string;
  activityDate: string;
  numberOfBeneficiaries: string;
  photosLinks: string;
  reportsLinks: string;
  photosDriveFolder: string;
  reportsDriveFolder: string;
}

export interface UploadedFile {
  name: string;
  id: string;
  url: string;
}

export const uploadFilesToGoogleDrive = async (files: File[], folderId: string): Promise<UploadedFile[]> => {
  // This is a simulation of Google Drive API upload
  // In a real implementation, you would use the Google Drive API
  console.log(`Uploading ${files.length} files to Google Drive folder: ${folderId}`);
  
  const uploadPromises = files.map(async (file) => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      name: file.name,
      id: fileId,
      url: `https://drive.google.com/file/d/${fileId}/view`
    };
  });
  
  return Promise.all(uploadPromises);
};

export const saveToGoogleSheets = async (formData: FormSubmission): Promise<void> => {
  // This is a simulation of Google Sheets API call
  // In a real implementation, you would use Google Sheets API or Google Apps Script
  
  console.log("Saving to Google Sheets:", formData);
  
  const sheetData = {
    range: 'Sheet1!A:J',
    values: [[
      formData.timestamp,
      formData.sdgGoal,
      formData.facultyCoordinators,
      formData.activityTitle,
      formData.activityDate,
      formData.numberOfBeneficiaries,
      formData.photosLinks,
      formData.reportsLinks,
      formData.photosDriveFolder,
      formData.reportsDriveFolder
    ]]
  };
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log("Data saved to Google Sheets:", sheetData);
};

export const formatSubmissionForSheets = (data: FormSubmission): string[][] => {
  return [
    ['Timestamp', 'SDG Goal', 'Faculty Coordinators', 'Activity Title', 'Activity Date', 'Beneficiaries', 'Photos Links', 'Reports Links', 'Photos Folder', 'Reports Folder'],
    [
      data.timestamp,
      data.sdgGoal,
      data.facultyCoordinators,
      data.activityTitle,
      data.activityDate,
      data.numberOfBeneficiaries,
      data.photosLinks,
      data.reportsLinks,
      data.photosDriveFolder,
      data.reportsDriveFolder
    ]
  ];
};
