using MediatR;
using Microsoft.EntityFrameworkCore;
using PrivilegePro.Infrastructure.Data;
using PrivilegePro.Infrastructure.Interfaces;
using PrivilegePro.Models.Core;
using PrivilegePro.Models.ViewModels.Commands;

namespace PrivilegePro.Features
{
    public class AgentDeleteRequestHandler : IRequestHandler<DeleteAgentsCommand, bool>
    {
        private readonly AppDbContext dbContext;
        private readonly IRepository<Agent> agentRepository;

        public AgentDeleteRequestHandler(AppDbContext dbContext,
            IRepository<Agent> agentRepository)
        {
            this.dbContext = dbContext;
            this.agentRepository = agentRepository;
        }

        public async Task<bool> Handle(DeleteAgentsCommand request, CancellationToken cancellationToken)
        {
            if(request.Ids.Length == 1 && request.Ids[0] == -1)
            {
                var tblName = dbContext.GetTableName<Agent>();
                var cmd = $"TRUNCATE TABLE {tblName}";
                await dbContext.Database.ExecuteSqlRawAsync(cmd, cancellationToken);
            }
            else
            {
                var agentsToDelete = request.Ids.Select(id => new Agent(id));
                await agentRepository.DeleteRangeAsync(agentsToDelete);
                await agentRepository.SaveChangesAsync(cancellationToken);
            }

            return true;
        }
    }
}
