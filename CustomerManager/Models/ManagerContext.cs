using System.Data.Entity;

namespace CustomerManager.Models
{
    public class ManagerContext : DbContext
    {
        public DbSet<Customer> Customers { get; set; }
    }
}