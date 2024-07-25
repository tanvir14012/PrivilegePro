using MediatR;
using PrivilegePro.Models.Core;

namespace PrivilegePro.Models.ViewModels.Commands
{
    public class SaveAgentCommand: IRequest<AgentViewModel>
    {
        public AgentViewModel AgentViewModel { get; set; }
        public SaveAgentCommand(AgentViewModel model)
        {
            AgentViewModel = model;
        }
    }
}
