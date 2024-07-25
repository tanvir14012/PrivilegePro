using AutoMapper;
using PrivilegePro.Models.ViewModels.DataTable;

namespace PrivilegePro.Infrastructure.Mapping
{
    public class DtParametersProfile: Profile
    {
        public DtParametersProfile()
        {
            CreateMap(typeof(DtParameters<>), typeof(DtParameters<>)).ConvertUsing(typeof(DtParametersTypeConverter<,>));
        }
    }
}
