using CsvHelper;
using Microsoft.EntityFrameworkCore;
using PrivilegePro.Models.Core;
using System.Globalization;

namespace PrivilegePro.Infrastructure.Data
{
    public class AppDbContextSeed
    {
        public static async Task SeedAsync(AppDbContext dbContext)
        {
            try
            {
                if (dbContext.Database.IsSqlServer())
                {
                    dbContext.Database.Migrate();
                }

                if (!await dbContext.Agents.AnyAsync())
                {
                    await dbContext.Agents.AddRangeAsync(GetAgents());
                    await dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
            }
        }

        static IEnumerable<Agent> GetAgents()
        {
            var path = Path.Join(AppContext.BaseDirectory, "Infrastructure/Data/Resources/Agents.csv");

            using (var reader = new StreamReader(path))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var records = csv.GetRecords<dynamic>();
                var agents = records.Select(r => new Agent(
                    r.Name,
                    r.Position,
                    r.Office,
                    int.Parse(r.Age),
                    DateTime.Parse(GetPropertyValue(r, "Start date")),
                    decimal.Parse(r.Salary, NumberStyles.AllowThousands | NumberStyles.AllowDecimalPoint | NumberStyles.AllowCurrencySymbol)
                )).ToList();

                return agents;
            }
        }

        static object GetPropertyValue(object obj, string propertyName)
        {
            var dictionary = obj as IDictionary<string, object>;
            if (dictionary == null)
            {
                throw new ArgumentException("Object is not a valid ExpandoObject.");
            }

            if (dictionary.TryGetValue(propertyName, out object value))
            {
                return value;
            }
            else
            {
                throw new ArgumentException($"Property '{propertyName}' not found.");
            }
        }
    }
}
