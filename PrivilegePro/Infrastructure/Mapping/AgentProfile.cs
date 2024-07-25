using AutoMapper;
using PrivilegePro.Models.Core;
using PrivilegePro.Models.ViewModels;

namespace PrivilegePro.Infrastructure.Mapping
{
    public class AgentProfile: Profile
    {
        public AgentProfile()
        {
            CreateMap<Agent, AgentViewModel>()
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate.ToString("yyyy-MM-dd")))
                .ForMember(dest => dest.Salary, opt => opt.MapFrom(src => src.Salary.ToString("C")))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()));

            CreateMap<AgentViewModel, Agent>()
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => DateTime.Parse(src.StartDate)))
                .ForMember(dest => dest.Salary, opt => opt.MapFrom(src => decimal.Parse(src.Salary, System.Globalization.NumberStyles.Currency)));
        }
    }
}
