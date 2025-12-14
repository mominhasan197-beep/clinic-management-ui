-- ============================================
-- Clinic Management System - Stored Procedures
-- ============================================

USE ClinicManagementDB;
GO

-- ============================================
-- SP: Get Doctors by Location
-- ============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetDoctorsByLocation]
    @LocationId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT
        d.[DoctorId],
        d.[Name],
        d.[Qualifications],
        d.[Specializations],
        d.[Experience],
        d.[Email],
        d.[Phone],
        d.[IsActive]
    FROM [dbo].[Doctors] d
    INNER JOIN [dbo].[DoctorAvailability] da ON d.[DoctorId] = da.[DoctorId]
    WHERE da.[LocationId] = @LocationId
        AND d.[IsActive] = 1
        AND da.[IsActive] = 1;
END
GO

-- ============================================
-- SP: Get Available Slots
-- ============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAvailableSlots]
    @DoctorId INT,
    @Date DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @DayOfWeek INT = DATEPART(WEEKDAY, @Date) - 1; -- 0=Sunday, 1=Monday
    
    -- Get doctor's availability for this day
    SELECT 
        da.[AvailabilityId],
        da.[StartTime],
        da.[EndTime],
        da.[SlotDuration],
        l.[LocationName]
    FROM [dbo].[DoctorAvailability] da
    INNER JOIN [dbo].[Locations] l ON da.[LocationId] = l.[LocationId]
    WHERE da.[DoctorId] = @DoctorId
        AND (da.[DayOfWeek] = @DayOfWeek OR da.[DayOfWeek] IS NULL)
        AND da.[IsActive] = 1;
    
    -- Get booked appointments for this doctor on this date
    SELECT 
        [AppointmentTime]
    FROM [dbo].[Appointments]
    WHERE [DoctorId] = @DoctorId
        AND [AppointmentDate] = @Date
        AND [Status] IN ('Upcoming', 'Completed');
END
GO

-- ============================================
-- SP: Book Appointment
-- ============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_BookAppointment]
    @PatientName NVARCHAR(200),
    @Age INT,
    @Mobile NVARCHAR(20),
    @Email NVARCHAR(100),
    @BloodGroup NVARCHAR(10) = NULL,
    @DoctorId INT,
    @LocationId INT,
    @AppointmentDate DATE,
    @AppointmentTime TIME,
    @Remarks NVARCHAR(1000) = NULL,
    @ReferenceNumber NVARCHAR(50) OUTPUT,
    @AppointmentId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Check if slot is already booked
        IF EXISTS (
            SELECT 1 FROM [dbo].[Appointments]
            WHERE [DoctorId] = @DoctorId
                AND [AppointmentDate] = @AppointmentDate
                AND [AppointmentTime] = @AppointmentTime
                AND [Status] IN ('Upcoming', 'Completed')
        )
        BEGIN
            RAISERROR('This time slot is already booked', 16, 1);
            RETURN;
        END
        
        -- Check if patient exists, if not create
        DECLARE @PatientId INT;
        SELECT @PatientId = [PatientId]
        FROM [dbo].[Patients]
        WHERE [Mobile] = @Mobile;
        
        IF @PatientId IS NULL
        BEGIN
            INSERT INTO [dbo].[Patients] ([Name], [Age], [Mobile], [Email], [BloodGroup])
            VALUES (@PatientName, @Age, @Mobile, @Email, @BloodGroup);
            
            SET @PatientId = SCOPE_IDENTITY();
        END
        ELSE
        BEGIN
            -- Update patient info if exists
            UPDATE [dbo].[Patients]
            SET [Name] = @PatientName,
                [Age] = @Age,
                [Email] = @Email,
                [BloodGroup] = COALESCE(@BloodGroup, [BloodGroup])
            WHERE [PatientId] = @PatientId;
        END
        
        -- Generate reference number
        SET @ReferenceNumber = 'APT-' + CONVERT(VARCHAR(4), YEAR(GETDATE())) + '-' + 
                               RIGHT('000000' + CAST(ABS(CHECKSUM(NEWID())) % 1000000 AS VARCHAR(6)), 6);
        
        -- Book appointment
        INSERT INTO [dbo].[Appointments] (
            [ReferenceNumber], [PatientId], [DoctorId], [LocationId],
            [AppointmentDate], [AppointmentTime], [Status], [Remarks]
        )
        VALUES (
            @ReferenceNumber, @PatientId, @DoctorId, @LocationId,
            @AppointmentDate, @AppointmentTime, 'Upcoming', @Remarks
        );
        
        SET @AppointmentId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- ============================================
-- SP: Get Appointments for Doctor
-- ============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetAppointmentsForDoctor]
    @DoctorId INT,
    @Period NVARCHAR(20) = 'today', -- today, week, month, year, all
    @StartDate DATE = NULL OUTPUT,
    @EndDate DATE = NULL OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Calculate date range based on period
    SET @EndDate = CAST(GETDATE() AS DATE);
    
    IF @Period = 'today'
        SET @StartDate = @EndDate;
    ELSE IF @Period = 'week'
        SET @StartDate = DATEADD(DAY, -DATEPART(WEEKDAY, @EndDate) + 1, @EndDate);
    ELSE IF @Period = 'month'
        SET @StartDate = DATEFROMPARTS(YEAR(@EndDate), MONTH(@EndDate), 1);
    ELSE IF @Period = 'year'
        SET @StartDate = DATEFROMPARTS(YEAR(@EndDate), 1, 1);
    ELSE
        SET @StartDate = '1900-01-01';
    
    -- Get appointments
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
        AND a.[AppointmentDate] BETWEEN @StartDate AND @EndDate
    ORDER BY a.[AppointmentDate], a.[AppointmentTime];
END
GO

-- ============================================
-- SP: Search Patient
-- ============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_SearchPatient]
    @SearchQuery NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.[PatientId],
        p.[Name],
        p.[Age],
        p.[Gender],
        p.[Mobile],
        p.[Email],
        p.[BloodGroup],
        p.[Address],
        p.[CreatedOn],
        COUNT(ph.[HistoryId]) AS TotalVisits,
        MAX(ph.[VisitDate]) AS LastVisit
    FROM [dbo].[Patients] p
    LEFT JOIN [dbo].[PatientHistory] ph ON p.[PatientId] = ph.[PatientId]
    WHERE p.[Name] LIKE '%' + @SearchQuery + '%'
        OR p.[Mobile] LIKE '%' + @SearchQuery + '%'
    GROUP BY 
        p.[PatientId], p.[Name], p.[Age], p.[Gender],
        p.[Mobile], p.[Email], p.[BloodGroup], p.[Address], p.[CreatedOn]
    ORDER BY p.[Name];
END
GO

-- ============================================
-- SP: Get Patient History
-- ============================================
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
    
    -- Get visit history
    SELECT 
        ph.[HistoryId],
        ph.[VisitDate],
        ph.[VisitTime],
        d.[Name] AS DoctorName,
        l.[LocationName],
        ph.[Diagnosis],
        ph.[Treatment],
        ph.[Notes],
        ph.[CreatedOn]
    FROM [dbo].[PatientHistory] ph
    INNER JOIN [dbo].[Doctors] d ON ph.[DoctorId] = d.[DoctorId]
    INNER JOIN [dbo].[Locations] l ON ph.[LocationId] = l.[LocationId]
    WHERE ph.[PatientId] = @PatientId
    ORDER BY ph.[VisitDate] DESC, ph.[VisitTime] DESC;
END
GO

-- ============================================
-- SP: Get Dashboard Stats
-- ============================================
CREATE OR ALTER PROCEDURE [dbo].[sp_GetDashboardStats]
    @DoctorId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Today DATE = CAST(GETDATE() AS DATE);
    DECLARE @WeekStart DATE = DATEADD(DAY, -DATEPART(WEEKDAY, @Today) + 1, @Today);
    DECLARE @MonthStart DATE = DATEFROMPARTS(YEAR(@Today), MONTH(@Today), 1);
    DECLARE @YearStart DATE = DATEFROMPARTS(YEAR(@Today), 1, 1);
    
    SELECT 
        (SELECT COUNT(*) FROM [dbo].[Appointments] 
         WHERE [DoctorId] = @DoctorId AND [AppointmentDate] = @Today) AS TodayCount,
        
        (SELECT COUNT(*) FROM [dbo].[Appointments] 
         WHERE [DoctorId] = @DoctorId AND [AppointmentDate] BETWEEN @WeekStart AND @Today) AS WeekCount,
        
        (SELECT COUNT(*) FROM [dbo].[Appointments] 
         WHERE [DoctorId] = @DoctorId AND [AppointmentDate] BETWEEN @MonthStart AND @Today) AS MonthCount,
        
        (SELECT COUNT(*) FROM [dbo].[Appointments] 
         WHERE [DoctorId] = @DoctorId AND [AppointmentDate] BETWEEN @YearStart AND @Today) AS YearCount;
END
GO

PRINT 'Stored procedures created successfully!';
