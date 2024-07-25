using AutoMapper;
using MediatR;
using PrivilegePro.Extensions;
using PrivilegePro.Infrastructure.Interfaces;
using PrivilegePro.Models.Core;
using PrivilegePro.Models.ViewModels;
using PrivilegePro.Models.ViewModels.Commands;

namespace PrivilegePro.Features
{
    public class AgentSaveRequestHandler : IRequestHandler<SaveAgentCommand, AgentViewModel>
    {
        private readonly IRepository<Agent> agentRepository;
        private readonly IMapper mapper;

        public AgentSaveRequestHandler(IRepository<Agent> agentRepository,
            IMapper mapper)
        {
            this.agentRepository = agentRepository;
            this.mapper = mapper;
        }
        public async Task<AgentViewModel> Handle(SaveAgentCommand request, CancellationToken cancellationToken)
        {
            var agent = mapper.Map<Agent>(request.AgentViewModel);
            var isCreated = false;
            Agent? agentEntity = null;

            if(agent.Id == 0)
            {
                await agentRepository.AddAsync(agent);
                isCreated = true;
            }
            else
            {
                agentEntity = await agentRepository.GetByIdAsync(agent.Id);
                if (agentEntity != null)
                {
                    agent.CopyPropertiesTo(agentEntity, "Id");
                    await agentRepository.UpdateAsync(agentEntity);
                }
                else
                {
                    throw new Exception("Agent is not found");
                }
            }
            await agentRepository.SaveChangesAsync(cancellationToken);
            var agentViewModel = mapper.Map<AgentViewModel>(isCreated ? agent : agentEntity);
            return agentViewModel;
        }
    }
}
