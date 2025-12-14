-- ============================================
-- SP: Update Get Patient History to Include Appointments
-- ============================================
USE ClinicManagementDB;
GO

-- Drop and recreate the stored procedure to include appointments
CREATE OR ALTER PROCEDURE [dbo].[sp_GetPatientHistory]
    @PatientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get patient details
    SELECT 
        [PatientId],
        [Name],
        [Age],
        [Gender],
        [Mobile],
        [Email],
        [BloodGroup],
        [Address]
    FROM [dbo].[Patients]
    WHERE [PatientId] = @PatientId;
    
    -- Get combined history from both PatientHistory and Appointments
    -- First: Get from PatientHistory table
    SELECT 
        ph.[HistoryId] AS HistoryId,
        NULL AS AppointmentId,
        ph.[VisitDate] AS VisitDate,
        ph.[VisitTime] AS VisitTime,
        d.[Name] AS DoctorName,
        l.[LocationName] AS LocationName,
        ph.[Diagnosis],
        ph.[Treatment],
        ph.[Notes] AS Notes,
        NULL AS Remarks,
        NULL AS Fees,
        ph.[CreatedOn]
    FROM [dbo].[PatientHistory] ph
    INNER JOIN [dbo].[Doctors] d ON ph.[DoctorId] = d.[DoctorId]
    INNER JOIN [dbo].[Locations] l ON ph.[LocationId] = l.[LocationId]
    WHERE ph.[PatientId] = @PatientId
    
    UNION ALL
    
    -- Second: Get from Appointments table (where diagnosis/treatment exists)
    SELECT 
        NULL AS HistoryId,
        a.[AppointmentId] AS AppointmentId,
        a.[AppointmentDate] AS VisitDate,
        a.[AppointmentTime] AS VisitTime,
        d.[Name] AS DoctorName,
        l.[LocationName] AS LocationName,
        a.[Diagnosis],
        a.[Treatment],
        a.[DoctorNotes] AS Notes,
        a.[Remarks],
        a.[Fees],
        a.[CreatedOn]
    FROM [dbo].[Appointments] a
    INNER JOIN [dbo].[Doctors] d ON a.[DoctorId] = d.[DoctorId]
    INNER JOIN [dbo].[Locations] l ON a.[LocationId] = l.[LocationId]
    WHERE a.[PatientId] = @PatientId
        AND (a.[Diagnosis] IS NOT NULL OR a.[Treatment] IS NOT NULL OR a.[Fees] IS NOT NULL)
    
    ORDER BY VisitDate DESC, VisitTime DESC;
END
GO

PRINT 'Stored procedure sp_GetPatientHistory updated successfully!';

