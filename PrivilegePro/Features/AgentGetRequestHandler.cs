using AutoMapper;
using MediatR;
using PrivilegePro.Infrastructure.Interfaces;
using PrivilegePro.Infrastructure.Specs;
using PrivilegePro.Models.Core;
using PrivilegePro.Models.ViewModels;
using PrivilegePro.Models.ViewModels.DataTable;

namespace PrivilegePro.Features
{
    public class AgentGetRequestHandler : IRequestHandler<DtParameters<AgentViewModel>, DtResult<AgentViewModel>>
    {
        private readonly IReadRepository<Agent> agentRepository;
        private readonly IMapper mapper;

        public AgentGetRequestHandler(IReadRepository<Agent> agentRepository,
            IMapper mapper)
        {
            this.agentRepository = agentRepository;
            this.mapper = mapper;
        }
        public async Task<DtResult<AgentViewModel>> Handle(DtParameters<AgentViewModel> requestParams, CancellationToken cancellationToken)
        {
            var mappedDtParams = mapper.Map<DtParameters<Agent>>(requestParams);
            var filterSpec = new AgentFilterSpec(mappedDtParams);
            var totalRecords = await agentRepository.CountAsync(cancellationToken);
            var filteredRecords = await agentRepository.CountAsync(filterSpec, cancellationToken);
            var agents = await agentRepository.ListAsync(filterSpec, cancellationToken);
            var data = agents.Select(ag => mapper.Map<AgentViewModel>(ag)).ToArray();

            return new DtResult<AgentViewModel>
            {
                Draw = requestParams.Draw,
                RecordsTotal = totalRecords,
                RecordsFiltered = filteredRecords,
                Data = data
            };
        }
    }
}
