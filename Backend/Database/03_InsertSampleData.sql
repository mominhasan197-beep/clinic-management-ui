-- ============================================
-- Clinic Management System - Sample Data
-- ============================================

USE ClinicManagementDB;
GO

-- ============================================
-- INSERT: Locations
-- ============================================
SET IDENTITY_INSERT [dbo].[Locations] ON;

IF NOT EXISTS (SELECT 1 FROM [dbo].[Locations] WHERE [LocationId] = 1)
BEGIN
    INSERT INTO [dbo].[Locations] ([LocationId], [LocationName], [Address], [City], [State], [Phone], [AvailableHours])
    VALUES (1, 'Nagpada', 'Shop No. 1, The Baya Junction, Ghodbunder Road', 'Thane', 'Maharashtra', '+91 22 1234 5678', '2:00 PM - 6:00 PM');
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[Locations] WHERE [LocationId] = 2)
BEGIN
    INSERT INTO [dbo].[Locations] ([LocationId], [LocationName], [Address], [City], [State], [Phone], [AvailableHours])
    VALUES (2, 'Bhiwandi', 'Bhiwandi Medical Center', 'Bhiwandi', 'Maharashtra', '+91 22 8765 4321', '10:00 AM - 2:00 PM, 6:00 PM - 10:00 PM');
END

SET IDENTITY_INSERT [dbo].[Locations] OFF;
GO

-- ============================================
-- INSERT: Doctors
-- ============================================
SET IDENTITY_INSERT [dbo].[Doctors] ON;

IF NOT EXISTS (SELECT 1 FROM [dbo].[Doctors] WHERE [DoctorId] = 1)
BEGIN
    INSERT INTO [dbo].[Doctors] ([DoctorId], [Name], [Qualifications], [Specializations], [Experience], [Email], [Phone])
    VALUES (1, 'Dr. Tahoora Momin', 'BPT, MPT (Orthopedics)', 'Sports Injury Rehabilitation,Post-Surgical Recovery,Orthopedic Conditions', 10, 'tahoora@clinic.com', '+91 98765 43210');
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[Doctors] WHERE [DoctorId] = 2)
BEGIN
    INSERT INTO [dbo].[Doctors] ([DoctorId], [Name], [Qualifications], [Specializations], [Experience], [Email], [Phone])
    VALUES (2, 'Dr. Ahmed Khan', 'BPT, MPT (Neurology)', 'Neurological Rehabilitation,Chronic Pain Management,Manual Therapy', 8, 'ahmed@clinic.com', '+91 98765 43211');
END

SET IDENTITY_INSERT [dbo].[Doctors] OFF;
GO

-- ============================================
-- INSERT: Doctor Availability
-- ============================================
-- Dr. Tahoora at Nagpada (2PM - 6PM daily)
INSERT INTO [dbo].[DoctorAvailability] ([DoctorId], [LocationId], [DayOfWeek], [StartTime], [EndTime], [SlotDuration])
VALUES (1, 1, NULL, '14:00:00', '18:00:00', 30); -- NULL means all days

-- Dr. Tahoora at Bhiwandi (10AM - 2PM, 6PM - 10PM daily)
INSERT INTO [dbo].[DoctorAvailability] ([DoctorId], [LocationId], [DayOfWeek], [StartTime], [EndTime], [SlotDuration])
VALUES (1, 2, NULL, '10:00:00', '14:00:00', 30);

INSERT INTO [dbo].[DoctorAvailability] ([DoctorId], [LocationId], [DayOfWeek], [StartTime], [EndTime], [SlotDuration])
VALUES (1, 2, NULL, '18:00:00', '22:00:00', 30);

-- Dr. Ahmed at Nagpada (2PM - 6PM daily)
INSERT INTO [dbo].[DoctorAvailability] ([DoctorId], [LocationId], [DayOfWeek], [StartTime], [EndTime], [SlotDuration])
VALUES (2, 1, NULL, '14:00:00', '18:00:00', 30);

-- Dr. Ahmed at Bhiwandi (10AM - 2PM, 6PM - 10PM daily)
INSERT INTO [dbo].[DoctorAvailability] ([DoctorId], [LocationId], [DayOfWeek], [StartTime], [EndTime], [SlotDuration])
VALUES (2, 2, NULL, '10:00:00', '14:00:00', 30);

INSERT INTO [dbo].[DoctorAvailability] ([DoctorId], [LocationId], [DayOfWeek], [StartTime], [EndTime], [SlotDuration])
VALUES (2, 2, NULL, '18:00:00', '22:00:00', 30);
GO

-- ============================================
-- INSERT: Doctor Login Credentials
-- ============================================
-- Password: "password123" (hashed with BCrypt)
-- You should change these passwords in production!

INSERT INTO [dbo].[DoctorsLogin] ([DoctorId], [Username], [PasswordHash])
VALUES (1, 'dr.tahoora', '$2a$11$8K1p/a0dL3LHgoH8YgWzAOkcUREefsJReOW4qMRoTBXId0tK8E5fC');

INSERT INTO [dbo].[DoctorsLogin] ([DoctorId], [Username], [PasswordHash])
VALUES (2, 'dr.ahmed', '$2a$11$8K1p/a0dL3LHgoH8YgWzAOkcUREefsJReOW4qMRoTBXId0tK8E5fC');
GO

-- ============================================
-- INSERT: Sample Patients
-- ============================================
SET IDENTITY_INSERT [dbo].[Patients] ON;

INSERT INTO [dbo].[Patients] ([PatientId], [Name], [Age], [Gender], [Mobile], [Email], [BloodGroup], [Address])
VALUES 
    (1, 'John Doe', 45, 'Male', '+91 98765 43210', 'john.doe@example.com', 'O+', 'Mumbai, Maharashtra'),
    (2, 'Sara Khan', 32, 'Female', '+91 98765 43211', 'sara.khan@example.com', 'A+', 'Thane, Maharashtra'),
    (3, 'Ahmed Patel', 28, 'Male', '+91 98765 43212', 'ahmed.patel@example.com', 'B+', 'Bhiwandi, Maharashtra'),
    (4, 'Priya Sharma', 38, 'Female', '+91 98765 43213', 'priya.sharma@example.com', 'AB+', 'Mumbai, Maharashtra'),
    (5, 'Rahul Verma', 52, 'Male', '+91 98765 43214', 'rahul.verma@example.com', 'O-', 'Thane, Maharashtra');

SET IDENTITY_INSERT [dbo].[Patients] OFF;
GO

-- ============================================
-- INSERT: Sample Appointments
-- ============================================
DECLARE @Today DATE = CAST(GETDATE() AS DATE);

INSERT INTO [dbo].[Appointments] ([ReferenceNumber], [PatientId], [DoctorId], [LocationId], [AppointmentDate], [AppointmentTime], [Status], [Remarks], [Diagnosis], [Treatment], [DoctorNotes], [Fees])
VALUES 
    ('APT-2025-001001', 1, 1, 2, @Today, '10:00:00', 'Completed', 'Lower back pain', 'Lower Back Pain', 'Manual Therapy', 'Session completed, advised exercises', 800.00),
    ('APT-2025-001002', 2, 1, 2, @Today, '10:30:00', 'Completed', 'Knee injury', 'Knee Pain', 'Electrotherapy', 'Improvement noted', 900.00),
    ('APT-2025-001003', 3, 1, 2, @Today, '11:00:00', 'Completed', 'Shoulder pain', 'Shoulder Pain', 'Therapeutic Exercise', 'Monitor ROM', 850.00),
    ('APT-2025-001004', 4, 1, 1, @Today, '14:00:00', 'Upcoming', 'Post-surgery rehabilitation', NULL, NULL, NULL, NULL),
    ('APT-2025-001005', 5, 1, 1, @Today, '14:30:00', 'Upcoming', 'Chronic back pain', NULL, NULL, NULL, NULL),
    ('APT-2025-001006', 1, 1, 2, DATEADD(DAY, 1, @Today), '10:00:00', 'Upcoming', 'Follow-up', NULL, NULL, NULL, NULL),
    ('APT-2025-001007', 2, 2, 1, DATEADD(DAY, 1, @Today), '14:00:00', 'Upcoming', 'Neurological assessment', NULL, NULL, NULL, NULL);
GO

-- ============================================
-- INSERT: Sample Patient History
-- ============================================
INSERT INTO [dbo].[PatientHistory] ([PatientId], [DoctorId], [LocationId], [VisitDate], [VisitTime], [Diagnosis], [Treatment], [Notes])
VALUES 
    (1, 1, 1, '2025-12-01', '14:00:00', 'Lower Back Pain', 'Manual Therapy', 'Significant improvement noted. Continue exercises.'),
    (1, 1, 1, '2025-11-24', '15:30:00', 'Lower Back Pain', 'Electrotherapy', 'Pain reduced by 40%. Recommended home exercises.'),
    (1, 2, 2, '2025-11-17', '10:30:00', 'Lower Back Pain', 'Manual Therapy', 'Initial assessment. Prescribed stretching routine.'),
    (1, 1, 1, '2025-10-10', '14:00:00', 'Knee Pain', 'Exercise Therapy', 'Post-surgery rehabilitation. Good progress.'),
    (1, 2, 2, '2025-09-05', '11:00:00', 'Knee Pain', 'Manual Therapy', 'Pre-surgery consultation and assessment.'),
    (2, 1, 2, '2025-11-28', '10:00:00', 'Sports Injury', 'Manual Therapy', 'Ankle sprain recovery progressing well.'),
    (3, 2, 2, '2025-11-20', '18:30:00', 'Chronic Pain', 'Pain Management', 'Prescribed pain management techniques.'),
    (4, 1, 1, '2025-11-15', '14:30:00', 'Post-Surgical', 'Rehabilitation', 'Hip replacement rehabilitation started.'),
    (5, 2, 1, '2025-11-10', '15:00:00', 'Back Pain', 'Manual Therapy', 'Chronic lower back pain assessment.');
GO

PRINT 'Sample data inserted successfully!';
PRINT 'Default login credentials:';
PRINT '  Username: dr.tahoora, Password: password123';
PRINT '  Username: dr.ahmed, Password: password123';
PRINT 'IMPORTANT: Change these passwords in production!';
