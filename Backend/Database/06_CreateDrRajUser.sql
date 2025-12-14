USE ClinicManagementDB;
GO

-- ============================================
-- Create or Update Dr. Raj User
-- ============================================

-- First, ensure the Doctor exists
IF NOT EXISTS (SELECT 1 FROM [dbo].[Doctors] WHERE [Name] LIKE '%Raj%')
BEGIN
    SET IDENTITY_INSERT [dbo].[Doctors] ON;
    
    DECLARE @DoctorId INT = 3; -- Use next available ID
    
    -- Check if ID 3 is available, if not find next available
    IF EXISTS (SELECT 1 FROM [dbo].[Doctors] WHERE [DoctorId] = @DoctorId)
    BEGIN
        SELECT @DoctorId = ISNULL(MAX([DoctorId]), 0) + 1 FROM [dbo].[Doctors];
    END
    
    INSERT INTO [dbo].[Doctors] ([DoctorId], [Name], [Qualifications], [Specializations], [Experience], [Email], [Phone], [IsActive])
    VALUES (@DoctorId, 'Dr. Raj', 'BPT, MPT', 'General Rehabilitation,Orthopedic Conditions', 5, 'raj@clinic.com', '+91 98765 43212', 1);
    
    SET IDENTITY_INSERT [dbo].[Doctors] OFF;
    
    PRINT 'Doctor Dr. Raj created with ID: ' + CAST(@DoctorId AS VARCHAR(10));
END
ELSE
BEGIN
    PRINT 'Doctor Dr. Raj already exists';
END
GO

-- Now, ensure the login credentials exist
DECLARE @DoctorIdForLogin INT;
SELECT @DoctorIdForLogin = [DoctorId] FROM [dbo].[Doctors] WHERE [Name] LIKE '%Raj%';

IF @DoctorIdForLogin IS NOT NULL
BEGIN
    -- Check if login already exists
    IF NOT EXISTS (SELECT 1 FROM [dbo].[DoctorsLogin] WHERE [DoctorId] = @DoctorIdForLogin)
    BEGIN
        -- Insert new login
        INSERT INTO [dbo].[DoctorsLogin] ([DoctorId], [Username], [PasswordHash])
        VALUES (@DoctorIdForLogin, 'dr.Raj', '$2a$11$8K1p/a0dL3LHgoH8YgWzAOkcUREefsJReOW4qMRoTBXId0tK8E5fC');
        PRINT 'Login credentials created for dr.Raj';
    END
    ELSE
    BEGIN
        -- Update existing login (username and password)
        UPDATE [dbo].[DoctorsLogin]
        SET [Username] = 'dr.Raj',
            [PasswordHash] = '$2a$11$8K1p/a0dL3LHgoH8YgWzAOkcUREefsJReOW4qMRoTBXId0tK8E5fC',
            [ModifiedOn] = GETDATE()
        WHERE [DoctorId] = @DoctorIdForLogin;
        PRINT 'Login credentials updated for dr.Raj';
    END
END
ELSE
BEGIN
    PRINT 'ERROR: Could not find or create Dr. Raj doctor record';
END
GO

PRINT 'Script completed. Login credentials:';
PRINT '  Username: dr.Raj';
PRINT '  Password: password123';
GO

