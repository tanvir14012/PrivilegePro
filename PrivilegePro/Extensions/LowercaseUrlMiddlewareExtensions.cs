using PrivilegePro.Models.Utility;

namespace PrivilegePro.Extensions
{
    public static class LowercaseUrlMiddlewareExtensions
    {
        public static IApplicationBuilder UseLowercaseUrls(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LowercaseUrlMiddleware>();
        }

    }
}
