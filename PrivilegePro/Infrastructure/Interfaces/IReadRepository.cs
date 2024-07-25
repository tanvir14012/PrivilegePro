using Ardalis.Specification;

namespace PrivilegePro.Infrastructure.Interfaces;

public interface IReadRepository<T> : IReadRepositoryBase<T> where T : class, IAggregateRoot
{
}
