using Ardalis.Specification;
using PrivilegePro.Models.Core;
using PrivilegePro.Models.ViewModels.DataTable;
using System.Linq.Expressions;

namespace PrivilegePro.Infrastructure.Specs
{
    public class AgentFilterSpec: Specification<Agent>
    {
        public AgentFilterSpec(DtParameters<Agent> dtParameters)
        {

            if (!string.IsNullOrEmpty(dtParameters.Search?.Value))
            {
                ApplySearch(dtParameters.Search.Value, dtParameters.Columns);
            }

            if (dtParameters.Order != null && dtParameters.Order.Length > 0)
            {
                ApplySorting(dtParameters.Order, dtParameters.Columns);
            }

            ApplyPaging(dtParameters.Start, dtParameters.Length);
        }

        private void ApplyPaging(int start, int length)
        {
            Query.Skip(start).Take(length);
        }

        private void ApplySearch(string searchValue, DtColumn[] columns)
        {
            var parameter = Expression.Parameter(typeof(Agent), "agnt");
            Expression orExpression = null;

            foreach (var column in columns)
            {
                if (column.Searchable)
                {
                    var property = Expression.Property(parameter, column.Data);

                    // Convert property to lowercase
                    var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
                    var propertyToLower = Expression.Call(property, toLowerMethod);

                    // Convert searchValue to lowercase
                    var searchValueLower = searchValue.ToLower();

                    var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                    var searchExpression = Expression.Call(propertyToLower, containsMethod, Expression.Constant(searchValueLower));

                    if (orExpression == null)
                    {
                        orExpression = searchExpression;
                    }
                    else
                    {
                        orExpression = Expression.OrElse(orExpression, searchExpression);
                    }
                }
            }

            if (orExpression != null)
            {
                var lambda = Expression.Lambda<Func<Agent, bool>>(orExpression, parameter);
                Query.Where(lambda);
            }


        }

        private void ApplySorting(DtOrder[] order, DtColumn[] columns)
        {
            var parameter = Expression.Parameter(typeof(Agent), "agnt");
            IOrderedSpecificationBuilder<Agent> orderedQuery = null;

            for (int i = 0; i < order.Length; i++)
            {
                var column = columns[order[i].Column];
                var property = Expression.Property(parameter, column.Data);

                var lambda = Expression.Lambda<Func<Agent, object>>(Expression.Convert(property, typeof(object)), parameter);

                if (order[i].Dir == DtOrderDir.Desc)
                {
                    if(i == 0)
                        orderedQuery = Query.OrderByDescending(lambda);
                    else
                        orderedQuery = orderedQuery.ThenByDescending(lambda);
                }
                else
                {
                    if (i == 0)
                        orderedQuery = Query.OrderBy(lambda);
                    else
                        orderedQuery = orderedQuery.ThenBy(lambda);

                }
            }
            
        }
    }
}
