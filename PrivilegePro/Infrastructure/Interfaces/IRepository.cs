using Ardalis.Specification;

namespace PrivilegePro.Infrastructure.Interfaces;

public interface IRepository<T> : IRepositoryBase<T> where T : class, IAggregateRoot
{
}
