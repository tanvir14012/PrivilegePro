using MediatR;

namespace PrivilegePro.Models.ViewModels.Commands
{
    public class DeleteAgentsCommand : IRequest<bool>
    {
        public int[] Ids { get; }

        public DeleteAgentsCommand(int[] ids)
        {
            Ids = ids;
        }
    }

}
