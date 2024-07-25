using Microsoft.EntityFrameworkCore;
using PrivilegePro.Models.Core;
using System.Reflection;

namespace PrivilegePro.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> ops) : base(ops)
        {

        }

        public virtual DbSet<Agent> Agents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        public string GetTableName<TEntity>() where TEntity : class
        {
            var entityType = Model.FindEntityType(typeof(TEntity));
            var schema = entityType.GetSchema();
            var tableName = entityType.GetTableName();

            return $"{schema}.{tableName}";
        }
    }
}
