using Microsoft.Data.SqlClient;
using System.Data;

namespace ClinicManagementAPI.Data
{
    public interface IDbContext
    {
        IDbConnection CreateConnection();
    }

    public class DbContext : IDbContext
    {
        private readonly string _connectionString;

        public DbContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found");
        }

        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
