# Quick Start Guide - Clinic Management System

## 🚀 Get Started in 5 Minutes

### Prerequisites
- ✅ SQL Server installed (Express or higher)
- ✅ .NET 8 SDK installed
- ✅ Node.js and Angular CLI installed

---

## Step 1: Setup Database (2 minutes)

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Execute these scripts **in order**:

```sql
-- Script 1: Create database and tables
-- File: Backend/Database/01_CreateSchema.sql

-- Script 2: Create stored procedures  
-- File: Backend/Database/02_CreateStoredProcedures.sql

-- Script 3: Insert sample data
-- File: Backend/Database/03_InsertSampleData.sql
```

✅ **Verify**: Database `ClinicManagementDB` should now exist with 7 tables and sample data.

---

## Step 2: Configure Backend (30 seconds)

Edit `Backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ClinicManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

💡 **Tip**: Replace `localhost` with your SQL Server instance name if different.

---

## Step 3: Run Backend (1 minute)

```bash
cd Backend
dotnet run
```

✅ **Success indicators:**
- Console shows: "Now listening on: https://localhost:7xxx"
- Swagger UI available at: `https://localhost:7xxx/swagger`

---

## Step 4: Test API (1 minute)

Open Swagger UI in your browser and test:

1. **GET /api/appointment/locations** - Should return 2 locations
2. **POST /api/doctor/login** - Test with:
   ```json
   {
     "username": "dr.tahoora",
     "password": "password123"
   }
   ```

---

## Step 5: Run Angular Frontend (30 seconds)

```bash
# In a new terminal
cd d:\Project\Angular\Practice
npm start
```

Angular will run on: `http://localhost:4200` or `http://localhost:59296`

---

## 🎯 Quick Test Checklist

### Backend API Tests (via Swagger)
- [ ] GET locations returns Nagpada and Bhiwandi
- [ ] GET doctors for location 1 returns Dr. Tahoora
- [ ] POST login with dr.tahoora/password123 succeeds
- [ ] GET dashboard stats returns appointment counts

### Frontend Tests (in Browser)
- [ ] Navigate to `/book-appointment` - Shows location selector
- [ ] Location cards display correctly with hours
- [ ] Luxury black & gold theme is applied

---

## 📊 Sample Data Overview

**Locations:**
- Nagpada (ID: 1) - 2PM to 6PM
- Bhiwandi (ID: 2) - 10AM to 2PM, 6PM to 10PM

**Doctors:**
- Dr. Tahoora Momin (ID: 1) - Both locations
- Dr. Ahmed Khan (ID: 2) - Both locations

**Login Credentials:**
- Username: `dr.tahoora` | Password: `password123`
- Username: `dr.ahmed` | Password: `password123`

**Sample Patients:** 5 patients with complete profiles
**Sample Appointments:** 7 appointments (some today, some future)
**Patient History:** 9 visit records

---

## 🔧 Troubleshooting

### "Cannot connect to database"
**Solution:** 
1. Check SQL Server is running
2. Verify connection string in `appsettings.json`
3. Ensure database `ClinicManagementDB` exists

### "CORS error in browser"
**Solution:**
1. Verify backend is running
2. Check Angular URL matches CORS policy in `Program.cs`
3. Restart both backend and frontend

### "404 Not Found on API calls"
**Solution:**
1. Check backend URL in Angular service matches actual backend port
2. Verify backend is running on the expected port
3. Check Swagger UI to confirm endpoints exist

### "Build failed"
**Solution:**
1. Run `dotnet restore` in Backend folder
2. Check all NuGet packages installed correctly
3. Verify .NET 8 SDK is installed: `dotnet --version`

---

## 📁 Project Structure

```
d:\Project\Angular\Practice\
├── Backend/                    # .NET 8 Web API
│   ├── Controllers/           # 4 API controllers
│   ├── Services/              # Business logic
│   ├── Repository/            # Data access (Dapper)
│   ├── Models/                # Entities, DTOs
│   ├── Database/              # SQL scripts
│   └── ANGULAR_INTEGRATION_GUIDE.md
├── src/                       # Angular frontend
│   ├── app/
│   │   ├── pages/
│   │   │   ├── book-appointment/
│   │   │   ├── doctor-login/
│   │   │   ├── doctor-dashboard/
│   │   │   └── patient-search/
│   │   └── services/          # Create ClinicApiService here
│   └── lux-cards.scss         # Luxury theme styles
└── DESIGN-SYSTEM.md           # UI design guidelines
```

---

## 🎨 Key Features

### Backend (11 API Endpoints)
✅ Appointment booking with slot validation  
✅ Doctor authentication with BCrypt  
✅ Dashboard analytics (today/week/month/year)  
✅ Patient search by name/mobile  
✅ Complete medical history tracking  
✅ PDF export with professional formatting  

### Frontend (Luxury Black & Gold Theme)
✅ 4-step booking flow with progress indicator  
✅ Location selector (Nagpada/Bhiwandi)  
✅ Doctor profiles with availability  
✅ Calendar with time slot picker  
✅ Doctor login and dashboard  
✅ Patient search and history viewer  

---

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Change Default Passwords**
   - Current: `password123` (for testing only)
   - Use strong passwords in production

2. **Update Connection String**
   - Use SQL Server authentication for production
   - Store connection string in environment variables

3. **Enable HTTPS**
   - Backend already configured for HTTPS
   - Use valid SSL certificate in production

4. **Add JWT Authentication** (Optional)
   - Current: Simple session ID
   - Consider JWT for stateless authentication

---

## 📚 Documentation

- **Implementation Plan**: `implementation_plan.md`
- **Walkthrough**: `walkthrough.md`
- **Angular Integration**: `Backend/ANGULAR_INTEGRATION_GUIDE.md`
- **Design System**: `DESIGN-SYSTEM.md`

---

## 🎉 You're All Set!

Your clinic management system is now running with:
- ✅ Complete backend API
- ✅ SQL Server database with sample data
- ✅ Luxury-themed Angular frontend
- ✅ Full integration ready

**Next Steps:**
1. Customize the UI to match your branding
2. Add more doctors and locations
3. Configure email notifications
4. Set up automated backups
5. Deploy to production

---

## 💡 Pro Tips

1. **Use Swagger for Testing**: `https://localhost:7xxx/swagger` - Test all endpoints before frontend integration

2. **Check Logs**: Backend logs appear in console - useful for debugging

3. **Sample Data**: Use the provided sample data to test all features before adding real data

4. **PDF Downloads**: Test PDF generation with patient ID 1 (John Doe) - has complete history

5. **Time Slots**: Bhiwandi has morning (10AM-2PM) and evening (6PM-10PM) slots - test both

---

## 🆘 Need Help?

Check these resources:
- Swagger UI for API documentation
- Browser console for frontend errors
- Backend console for API errors
- SQL Server Profiler for database queries

**Common Issues:**
- Port conflicts: Change ports in `launchSettings.json` (backend) or `angular.json` (frontend)
- Database timeout: Increase timeout in connection string
- CORS errors: Verify URLs match in `Program.cs`

---

**Happy Coding! 🚀**
