using System;
using System.ComponentModel.DataAnnotations;
using DataAnnotationsExtensions;

namespace CustomerManager.Models
{
    public class Customer
    {
        public int Id { get; set; }
        
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        [Required]
        [Email]
        public string Email { get; set; }

        public string Phone { get; set; }

        public string Description { get; set; }
    }
}