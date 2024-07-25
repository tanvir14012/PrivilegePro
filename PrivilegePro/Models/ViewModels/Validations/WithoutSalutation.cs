using System.ComponentModel.DataAnnotations;

namespace PrivilegePro.Models.ViewModels.Validations
{
    public class WithoutSalutation: ValidationAttribute
    {
        private readonly string[] salutations;

        public WithoutSalutation(string[] salutations)
        {
            this.salutations = salutations.Select(s => s.ToLower()).ToArray();
        }
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is not string name || string.IsNullOrWhiteSpace(name))
            {
                return ValidationResult.Success;
            }

            foreach (var item in salutations)
            {
                if (name.Contains(item, StringComparison.OrdinalIgnoreCase))
                {
                    return new ValidationResult($"The name should not contain the salutation: {item}");
                }
            }

            return ValidationResult.Success;
        }

    }
}
