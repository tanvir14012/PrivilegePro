using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace PrivilegePro.Models.Utility
{
    public class LowercaseUrlMiddleware
    {
        private readonly RequestDelegate _next;

        public LowercaseUrlMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.HasValue)
            {
                var lowercasePath = Regex.Replace(context.Request.Path.Value, "([a-z])([A-Z])", "$1-$2").ToLower();
                if (context.Request.Path.Value != lowercasePath)
                {
                    context.Request.Path = lowercasePath;
                }
            }
            await _next(context);
        }
    }
}
