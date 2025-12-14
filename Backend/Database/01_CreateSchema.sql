-- ============================================
-- Clinic Management System - Database Schema
-- SQL Server Database Creation Script
-- ============================================

USE master;
GO

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ClinicManagementDB')
BEGIN
    CREATE DATABASE ClinicManagementDB;
END
GO

USE ClinicManagementDB;
GO

-- ============================================
-- TABLE: Locations
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Locations]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Locations] (
        [LocationId] INT PRIMARY KEY IDENTITY(1,1),
        [LocationName] NVARCHAR(100) NOT NULL,
        [Address] NVARCHAR(500),
        [City] NVARCHAR(100),
        [State] NVARCHAR(100),
        [Phone] NVARCHAR(20),
        [AvailableHours] NVARCHAR(200),
        [IsActive] BIT DEFAULT 1,
        [CreatedOn] DATETIME DEFAULT GETDATE()
    );
END
GO

-- ============================================
-- TABLE: Doctors
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Doctors]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Doctors] (
        [DoctorId] INT PRIMARY KEY IDENTITY(1,1),
        [Name] NVARCHAR(200) NOT NULL,
        [Qualifications] NVARCHAR(500),
        [Specializations] NVARCHAR(500),
        [Experience] INT,
        [Email] NVARCHAR(100),
        [Phone] NVARCHAR(20),
        [IsActive] BIT DEFAULT 1,
        [CreatedOn] DATETIME DEFAULT GETDATE()
    );
END
GO

-- ============================================
-- TABLE: DoctorAvailability
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DoctorAvailability]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[DoctorAvailability] (
        [AvailabilityId] INT PRIMARY KEY IDENTITY(1,1),
        [DoctorId] INT NOT NULL,
        [LocationId] INT NOT NULL,
        [DayOfWeek] INT, -- 0=Sunday, 1=Monday, etc. NULL=All days
        [StartTime] TIME NOT NULL,
        [EndTime] TIME NOT NULL,
        [SlotDuration] INT DEFAULT 30, -- minutes
        [IsActive] BIT DEFAULT 1,
        CONSTRAINT FK_DoctorAvailability_Doctor FOREIGN KEY ([DoctorId]) REFERENCES [dbo].[Doctors]([DoctorId]),
        CONSTRAINT FK_DoctorAvailability_Location FOREIGN KEY ([LocationId]) REFERENCES [dbo].[Locations]([LocationId])
    );
END
GO

-- ============================================
-- TABLE: DoctorsLogin
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DoctorsLogin]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[DoctorsLogin] (
        [LoginId] INT PRIMARY KEY IDENTITY(1,1),
        [DoctorId] INT NOT NULL UNIQUE,
        [Username] NVARCHAR(100) UNIQUE NOT NULL,
        [PasswordHash] NVARCHAR(500) NOT NULL,
        [LastLogin] DATETIME,
        [CreatedOn] DATETIME DEFAULT GETDATE(),
        [ModifiedOn] DATETIME,
        CONSTRAINT FK_DoctorsLogin_Doctor FOREIGN KEY ([DoctorId]) REFERENCES [dbo].[Doctors]([DoctorId])
    );
END
GO

-- ============================================
-- TABLE: Patients
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Patients]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Patients] (
        [PatientId] INT PRIMARY KEY IDENTITY(1,1),
        [Name] NVARCHAR(200) NOT NULL,
        [Age] INT,
        [Gender] NVARCHAR(10),
        [Mobile] NVARCHAR(20) NOT NULL,
        [Email] NVARCHAR(100),
        [BloodGroup] NVARCHAR(10),
        [Address] NVARCHAR(500),
        [CreatedOn] DATETIME DEFAULT GETDATE()
    );
    
    -- Create index on Mobile for faster search
    CREATE NONCLUSTERED INDEX IX_Patients_Mobile ON [dbo].[Patients]([Mobile]);
    CREATE NONCLUSTERED INDEX IX_Patients_Name ON [dbo].[Patients]([Name]);
END
GO

-- ============================================
-- TABLE: Appointments
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Appointments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Appointments] (
        [AppointmentId] INT PRIMARY KEY IDENTITY(1,1),
        [ReferenceNumber] NVARCHAR(50) UNIQUE NOT NULL,
        [PatientId] INT NOT NULL,
        [DoctorId] INT NOT NULL,
        [LocationId] INT NOT NULL,
        [AppointmentDate] DATE NOT NULL,
        [AppointmentTime] TIME NOT NULL,
        [Status] NVARCHAR(20) DEFAULT 'Upcoming', -- Upcoming, Completed, Cancelled
        [Remarks] NVARCHAR(1000),
        [Diagnosis] NVARCHAR(500),
        [Treatment] NVARCHAR(1000),
        [DoctorNotes] NVARCHAR(2000),
        [Fees] DECIMAL(10,2) NULL,
        [CreatedOn] DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_Appointments_Patient FOREIGN KEY ([PatientId]) REFERENCES [dbo].[Patients]([PatientId]),
        CONSTRAINT FK_Appointments_Doctor FOREIGN KEY ([DoctorId]) REFERENCES [dbo].[Doctors]([DoctorId]),
        CONSTRAINT FK_Appointments_Location FOREIGN KEY ([LocationId]) REFERENCES [dbo].[Locations]([LocationId])
    );
    
    -- Create indexes for faster queries
    CREATE NONCLUSTERED INDEX IX_Appointments_DoctorDate ON [dbo].[Appointments]([DoctorId], [AppointmentDate]);
    CREATE NONCLUSTERED INDEX IX_Appointments_DateTime ON [dbo].[Appointments]([AppointmentDate], [AppointmentTime]);
END
GO

-- ============================================
-- TABLE: PatientHistory
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PatientHistory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[PatientHistory] (
        [HistoryId] INT PRIMARY KEY IDENTITY(1,1),
        [PatientId] INT NOT NULL,
        [DoctorId] INT NOT NULL,
        [LocationId] INT NOT NULL,
        [VisitDate] DATE NOT NULL,
        [VisitTime] TIME NOT NULL,
        [Diagnosis] NVARCHAR(500),
        [Treatment] NVARCHAR(1000),
        [Notes] NVARCHAR(2000),
        [CreatedOn] DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_PatientHistory_Patient FOREIGN KEY ([PatientId]) REFERENCES [dbo].[Patients]([PatientId]),
        CONSTRAINT FK_PatientHistory_Doctor FOREIGN KEY ([DoctorId]) REFERENCES [dbo].[Doctors]([DoctorId]),
        CONSTRAINT FK_PatientHistory_Location FOREIGN KEY ([LocationId]) REFERENCES [dbo].[Locations]([LocationId])
    );
    
    -- Create index for patient history queries
    CREATE NONCLUSTERED INDEX IX_PatientHistory_Patient ON [dbo].[PatientHistory]([PatientId], [VisitDate] DESC);
END
GO

PRINT 'Database schema created successfully!';
