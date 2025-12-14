USE ClinicManagementDB;
GO

-- Add Diagnosis column if it doesn't exist
IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'Diagnosis'
          AND Object_ID = Object_ID(N'dbo.Appointments'))
BEGIN
    ALTER TABLE dbo.Appointments
    ADD Diagnosis NVARCHAR(500) NULL;
    PRINT 'Added Diagnosis column';
END
GO

-- Add Treatment column if it doesn't exist
IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'Treatment'
          AND Object_ID = Object_ID(N'dbo.Appointments'))
BEGIN
    ALTER TABLE dbo.Appointments
    ADD Treatment NVARCHAR(1000) NULL;
    PRINT 'Added Treatment column';
END
GO

-- Add DoctorNotes column if it doesn't exist
IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'DoctorNotes'
          AND Object_ID = Object_ID(N'dbo.Appointments'))
BEGIN
    ALTER TABLE dbo.Appointments
    ADD DoctorNotes NVARCHAR(2000) NULL;
    PRINT 'Added DoctorNotes column';
END
GO

-- Add Fees column if it doesn't exist
IF NOT EXISTS(SELECT 1 FROM sys.columns 
          WHERE Name = N'Fees'
          AND Object_ID = Object_ID(N'dbo.Appointments'))
BEGIN
    ALTER TABLE dbo.Appointments
    ADD Fees DECIMAL(10,2) NULL;
    PRINT 'Added Fees column';
END
GO
