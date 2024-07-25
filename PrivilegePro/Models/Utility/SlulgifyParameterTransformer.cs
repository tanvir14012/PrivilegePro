using System.Text.RegularExpressions;

namespace PrivilegePro.Models.Utility
{
    public class SlugifyParameterTransformer : IOutboundParameterTransformer
    {
        string? IOutboundParameterTransformer.TransformOutbound(object? value)
        {
            if (value == null)
            {
                return null;
            }

            // Convert to lower-case and replace non-alphanumeric characters with a dash
            return Regex.Replace(value.ToString(), "([a-z])([A-Z])", "$1-$2").ToLower();
        }
    }

}
