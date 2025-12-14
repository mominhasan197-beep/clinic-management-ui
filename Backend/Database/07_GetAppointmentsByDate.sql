-- ============================================
-- SP: Get Appointments for Doctor by Specific Date
-- ============================================
USE ClinicManagementDB;
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsForDoctorByDate]
    @DoctorId INT,
    @AppointmentDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get appointments for specific date, sorted by time
    SELECT 
        a.[AppointmentId],
        a.[ReferenceNumber],
        a.[PatientId],
        p.[Name] AS PatientName,
        p.[Age],
        p.[Gender],
        p.[Mobile],
        p.[Email],
        a.[AppointmentDate],
        a.[AppointmentTime],
        l.[LocationName],
        a.[Status],
        a.[Remarks],
        a.[Diagnosis],
        a.[Treatment],
        a.[DoctorNotes],
        a.[Fees],
        a.[CreatedOn]
    FROM [dbo].[Appointments] a
    INNER JOIN [dbo].[Patients] p ON a.[PatientId] = p.[PatientId]
    INNER JOIN [dbo].[Locations] l ON a.[LocationId] = l.[LocationId]
    WHERE a.[DoctorId] = @DoctorId
        AND a.[AppointmentDate] = @AppointmentDate
    ORDER BY a.[AppointmentTime] ASC; -- Earliest to latest (sorted by time)
END
GO

PRINT 'Stored procedure sp_GetAppointmentsForDoctorByDate created successfully!';

