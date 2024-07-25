using Newtonsoft.Json;
using PrivilegePro.Models.ViewModels.Validations;
using System.ComponentModel.DataAnnotations;

namespace PrivilegePro.Models.ViewModels
{
    public class AgentViewModel
    {
        [JsonProperty("Id")]
        public int Id { get; set; }

        [JsonProperty("Name")]
        [Required]
        [MaxLength(256, ErrorMessage = "Name length has exceeded the limit")]
        [RegularExpression(@"^[a-zA-Z ]+$", ErrorMessage = "Use letters only")]
        [WithoutSalutation(new string[] { "Mr ", "Mrs ", "Ms ", "Dr ", "Sir ", 
            "Madam ", "Miss ", "Mx ", "Dame ", "Cllr ", "Lady ", "Lord ", "Doctor ",
            "Father ", "Captain ", "Master ", "Messrs " })]
        public string Name { get;  set; }

        [JsonProperty("Position")]
        [Required]
        [MaxLength(256, ErrorMessage = "Position length has exceeded the limit")]
        [RegularExpression(@"^[a-zA-Z- ]+$", ErrorMessage = "Use letters only")]
        public string Position { get;  set; }

        [JsonProperty("Office")]
        [Required]
        [MaxLength(100, ErrorMessage = "Office length has exceeded the limit")]
        [RegularExpression(@"^[a-zA-Z ]+$", ErrorMessage = "Use letters only")]
        public string Office { get;  set; }

        [JsonProperty("Age")]
        [Required]
        [Range(1, 130, ErrorMessage = "Age should be within the range [1, 130]")]
        public int Age { get;  set; }

        [JsonProperty("StartDate")]
        [Required]
        [Display(Name = "Start Date")]
        [DataType(DataType.Date)]
        public string StartDate { get;  set; }

        [JsonProperty("Salary")]
        [Required]
        [Range(1000, 999999999, ErrorMessage = "Salary should be within the range [1000, 999999999]")]
        public string Salary { get;  set; }
    }
}
