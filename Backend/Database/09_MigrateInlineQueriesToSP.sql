-- ============================================
-- Clinic Management System - Migration Script
-- Refactor Inline Queries to Stored Procedures
-- ============================================

USE ClinicManagementDB;
GO

-- ============================================
-- ADMIN FEATURES
-- ============================================

-- 1. Get Admin By Username
CREATE OR ALTER PROCEDURE [dbo].[sp_Admin_GetByUsername]
    @Username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[SuperAdmins] WHERE [Username] = @Username;
END
GO

-- 2. Update Admin Last Login
CREATE OR ALTER PROCEDURE [dbo].[sp_Admin_UpdateLastLogin]
    @AdminId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[SuperAdmins] SET [LastLogin] = GETDATE() WHERE [AdminId] = @AdminId;
END
GO

-- 3. Get Global Stats
CREATE OR ALTER PROCEDURE [dbo].[sp_Admin_GetGlobalStats]
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Result Set 1: Total Counts
    SELECT 
        (SELECT COUNT(*) FROM [dbo].[Appointments]) as Total,
        (SELECT COUNT(*) FROM [dbo].[Appointments] WHERE CAST([AppointmentDate] AS DATE) = CAST(GETDATE() AS DATE)) as Today,
        (SELECT COUNT(*) FROM [dbo].[Appointments] WHERE [AppointmentDate] >= DATEADD(day, -7, GETDATE())) as Week,
        (SELECT COUNT(*) FROM [dbo].[Appointments] WHERE MONTH([AppointmentDate]) = MONTH(GETDATE()) AND YEAR([AppointmentDate]) = YEAR(GETDATE())) as Month;

    -- Result Set 2: Appointments Per Doctor
    SELECT d.[Name] as DoctorName, COUNT(a.[AppointmentId]) as Count
    FROM [dbo].[Appointments] a
    JOIN [dbo].[Doctors] d ON a.[DoctorId] = d.[DoctorId]
    GROUP BY d.[Name];

    -- Result Set 3: Appointments Per Location
    SELECT l.[LocationName], COUNT(a.[AppointmentId]) as Count
    FROM [dbo].[Appointments] a
    JOIN [dbo].[Locations] l ON a.[LocationId] = l.[LocationId]
    GROUP BY l.[LocationName];
END
GO

-- 4. Get All Appointments (with filters)
CREATE OR ALTER PROCEDURE [dbo].[sp_Admin_GetAllAppointments]
    @DoctorName NVARCHAR(200) = NULL,
    @Location NVARCHAR(100) = NULL,
    @Status NVARCHAR(20) = NULL,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @PatientId INT = NULL,
    @SearchTerm NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        a.*, 
        p.[Name] as PatientName, 
        p.[Age], 
        p.[Gender], 
        p.[Mobile], 
        p.[Email], 
        l.[LocationName], 
        d.[Name] as DoctorName
    FROM [dbo].[Appointments] a
    JOIN [dbo].[Patients] p ON a.[PatientId] = p.[PatientId]
    JOIN [dbo].[Locations] l ON a.[LocationId] = l.[LocationId]
    JOIN [dbo].[Doctors] d ON a.[DoctorId] = d.[DoctorId]
    WHERE 
        (@DoctorName IS NULL OR d.[Name] LIKE '%' + @DoctorName + '%') AND
        (@Location IS NULL OR l.[LocationName] LIKE '%' + @Location + '%') AND
        (@Status IS NULL OR a.[Status] = @Status) AND
        (@StartDate IS NULL OR CAST(a.[AppointmentDate] AS DATE) >= @StartDate) AND
        (@EndDate IS NULL OR CAST(a.[AppointmentDate] AS DATE) <= @EndDate) AND
        (@PatientId IS NULL OR a.[PatientId] = @PatientId) AND
        (@SearchTerm IS NULL OR (p.[Name] LIKE '%' + @SearchTerm + '%' OR a.[ReferenceNumber] LIKE '%' + @SearchTerm + '%'))
    ORDER BY a.[AppointmentDate] DESC, a.[AppointmentTime] DESC;
END
GO

-- 5. Get All Patients (paginated with search)
CREATE OR ALTER PROCEDURE [dbo].[sp_Admin_GetAllPatients]
    @SearchTerm NVARCHAR(200) = NULL,
    @Page INT = 1,
    @PageSize INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Offset INT = (@Page - 1) * @PageSize;

    -- Result Set 1: Total Count
    SELECT COUNT(*) 
    FROM [dbo].[Patients] p 
    WHERE (@SearchTerm IS NULL OR (p.[Name] LIKE '%' + @SearchTerm + '%' OR p.[Mobile] LIKE '%' + @SearchTerm + '%'));

    -- Result Set 2: Paginated Data
    SELECT 
        p.[PatientId],
        p.[Name],
        p.[Age],
        p.[Gender],
        p.[Mobile],
        p.[Email],
        p.[BloodGroup],
        (SELECT COUNT(*) FROM [dbo].[Appointments] a WHERE a.[PatientId] = p.[PatientId]) as TotalVisits,
        (SELECT TOP 1 [AppointmentDate] FROM [dbo].[Appointments] a WHERE a.[PatientId] = p.[PatientId] ORDER BY [AppointmentDate] DESC) as LastVisit
    FROM [dbo].[Patients] p 
    WHERE (@SearchTerm IS NULL OR (p.[Name] LIKE '%' + @SearchTerm + '%' OR p.[Mobile] LIKE '%' + @SearchTerm + '%'))
    ORDER BY p.[Name]
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;
END
GO

-- ============================================
-- APPOINTMENT FEATURES
-- ============================================

-- 6. Get Active Locations
CREATE OR ALTER PROCEDURE [dbo].[sp_Appointment_GetLocations]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT [LocationId], [LocationName], [Address], [City], [State], [Phone], [AvailableHours], [IsActive]
    FROM [dbo].[Locations]
    WHERE [IsActive] = 1;
END
GO

-- 7. Get Available Slots (Detailed)
CREATE OR ALTER PROCEDURE [dbo].[sp_Appointment_GetAvailableSlots]
    @DoctorId INT,
    @LocationId INT,
    @Date DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Result Set 1: Availability
    SELECT * FROM [dbo].[DoctorAvailability] 
    WHERE [DoctorId] = @DoctorId 
      AND [LocationId] = @LocationId 
      AND [IsActive] = 1;

    -- Result Set 2: Booked Slots
    SELECT [AppointmentTime] 
    FROM [dbo].[Appointments] 
    WHERE [DoctorId] = @DoctorId 
      AND [LocationId] = @LocationId 
      AND CAST([AppointmentDate] AS DATE) = CAST(@Date AS DATE) 
      AND [Status] != 'Cancelled';
END
GO

-- 8. Get Appointment By Id
CREATE OR ALTER PROCEDURE [dbo].[sp_Appointment_GetById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Appointments] WHERE [AppointmentId] = @Id;
END
GO

-- 9. Update Appointment (Flexible)
CREATE OR ALTER PROCEDURE [dbo].[sp_Appointment_Update]
    @AppointmentId INT,
    @Status NVARCHAR(20) = NULL,
    @Remarks NVARCHAR(1000) = NULL,
    @Diagnosis NVARCHAR(500) = NULL,
    @Treatment NVARCHAR(1000) = NULL,
    @DoctorNotes NVARCHAR(2000) = NULL,
    @Fees DECIMAL(10,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Appointments]
    SET [Status] = COALESCE(@Status, [Status]),
        [Remarks] = COALESCE(@Remarks, [Remarks]),
        [Diagnosis] = COALESCE(@Diagnosis, [Diagnosis]),
        [Treatment] = COALESCE(@Treatment, [Treatment]),
        [DoctorNotes] = COALESCE(@DoctorNotes, [DoctorNotes]),
        [Fees] = COALESCE(@Fees, [Fees])
    WHERE [AppointmentId] = @AppointmentId;
END
GO

-- ============================================
-- DOCTOR FEATURES
-- ============================================

-- 10. Get Doctor Login Info
CREATE OR ALTER PROCEDURE [dbo].[sp_Doctor_GetLogin]
    @Username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[DoctorsLogin] WHERE LOWER([Username]) = LOWER(@Username);
END
GO

-- 11. Get Doctor By Id
CREATE OR ALTER PROCEDURE [dbo].[sp_Doctor_GetById]
    @DoctorId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Doctors] WHERE [DoctorId] = @DoctorId;
END
GO

-- 12. Get Doctor Appointments (with filters)
CREATE OR ALTER PROCEDURE [dbo].[sp_Doctor_GetAppointments]
    @DoctorId INT,
    @Period NVARCHAR(20) = 'all' -- today, week, month, all
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Today DATE = CAST(GETDATE() AS DATE);

    SELECT * FROM [dbo].[Appointments]
    WHERE [DoctorId] = @DoctorId
      AND (@Period = 'all' OR
           (@Period = 'today' AND [AppointmentDate] = @Today) OR
           (@Period = 'week' AND [AppointmentDate] >= @Today AND [AppointmentDate] <= DATEADD(day, 7, @Today)) OR
           (@Period = 'month' AND MONTH([AppointmentDate]) = MONTH(@Today) AND YEAR([AppointmentDate]) = YEAR(@Today)))
    ORDER BY [AppointmentDate] ASC, [AppointmentTime] ASC;
END
GO

-- 13. Get Doctor Appointments By Month
CREATE OR ALTER PROCEDURE [dbo].[sp_Doctor_GetAppointmentsByMonth]
    @DoctorId INT,
    @Month INT,
    @Year INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Appointments]
    WHERE [DoctorId] = @DoctorId 
      AND MONTH([AppointmentDate]) = @Month
      AND YEAR([AppointmentDate]) = @Year
    ORDER BY [AppointmentDate] ASC, [AppointmentTime] ASC;
END
GO

-- 14. Update Doctor Last Login
CREATE OR ALTER PROCEDURE [dbo].[sp_Doctor_UpdateLastLogin]
    @DoctorId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[DoctorsLogin] SET [LastLogin] = GETDATE() WHERE [DoctorId] = @DoctorId;
END
GO

-- ============================================
-- PATIENT FEATURES
-- ============================================

-- 15. Get Patient By Id
CREATE OR ALTER PROCEDURE [dbo].[sp_Patient_GetById]
    @PatientId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Patients] WHERE [PatientId] = @PatientId;
END
GO

-- 16. Get Patient Appointment History By Mobile
CREATE OR ALTER PROCEDURE [dbo].[sp_Patient_GetAppointmentHistoryByMobile]
    @Mobile NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Result Set 1: Patient Details
    SELECT TOP 1 *
    FROM [dbo].[Patients]
    WHERE REPLACE([Mobile], ' ', '') LIKE '%' + @Mobile + '%';

    -- Result Set 2: Appointments
    SELECT 
        a.*,
        p.[Name] as PatientName, p.[Age], p.[Mobile], p.[Email],
        d.[Name] as DoctorName,
        l.[LocationName]
    FROM [dbo].[Appointments] a
    INNER JOIN [dbo].[Patients] p ON a.[PatientId] = p.[PatientId]
    INNER JOIN [dbo].[Doctors] d ON a.[DoctorId] = d.[DoctorId]
    INNER JOIN [dbo].[Locations] l ON a.[LocationId] = l.[LocationId]
    WHERE REPLACE(p.[Mobile], ' ', '') LIKE '%' + @Mobile + '%'
    ORDER BY a.[AppointmentDate] DESC, a.[AppointmentTime] DESC;
END
GO

PRINT 'All migration stored procedures created successfully!';
