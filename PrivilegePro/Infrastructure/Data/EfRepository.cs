using Ardalis.Specification.EntityFrameworkCore;
using PrivilegePro.Infrastructure.Data;
using PrivilegePro.Infrastructure.Interfaces;


public class EfRepository<T> : RepositoryBase<T>, IReadRepository<T>, IRepository<T> where T : class, IAggregateRoot
{
    public EfRepository(AppDbContext dbContext) : base(dbContext)
    {
    }
}
