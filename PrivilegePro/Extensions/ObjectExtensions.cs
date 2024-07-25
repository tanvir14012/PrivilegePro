using System.Reflection;

namespace PrivilegePro.Extensions
{
    public static class ObjectExtensions
    {
        public static void CopyPropertiesTo<T>(this T source, T destination, params string[] excludeProperties)
        {
            if (source == null || destination == null)
                throw new ArgumentNullException("Source or/and Destination Objects are null");

            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                      .Where(prop => prop.CanRead && prop.CanWrite);

            foreach (var property in properties)
            {
                if (excludeProperties.Contains(property.Name))
                    continue;

                var value = property.GetValue(source);
                property.SetValue(destination, value);
            }
        }
    }
}
