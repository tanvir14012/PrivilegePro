using PrivilegePro.Infrastructure.Interfaces;

namespace PrivilegePro.Models.Core
{
    public class Agent: BaseEntity, IAggregateRoot
    {
        public string Name { get; private set; }
        public string Position { get; private set; }
        public string Office { get; private set; }
        public int Age { get; private set; }
        public DateTime StartDate { get; private set; }
        public decimal Salary { get; private set; }
        public DateTime CreatedOnUtc { get; private set; }
        public DateTime ModifiedOnUtc { get; private set; }

        public Agent(string name, string position, string office, int age, DateTime startDate, decimal salary)
        {
            Name = name;
            Position = position;
            Office = office;
            Age = age;
            StartDate = startDate;
            Salary = salary;
        }
        public Agent(int id)
        {
            this.Id = id;
        }
    }
}
