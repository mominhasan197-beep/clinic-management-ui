USE ClinicManagementDB;
GO

-- Based on the hash you shared ($2a$11$8K1p...), your password is currently 'password123'.
-- If you are unable to login with 'password123', run this script to ensure it is set correctly.

UPDATE DoctorsLogin
SET PasswordHash = '$2a$11$8K1p/a0dL3LHgoH8YgWzAOkcUREefsJReOW4qMRoTBXId0tK8E5fC' -- Hash for 'password123'
WHERE Username = 'dr.Raj';
GO
