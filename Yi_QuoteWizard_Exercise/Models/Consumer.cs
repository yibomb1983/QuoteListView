using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Yi_QuoteWizard_Exercise.Models
{
    public class Consumer
    {
        public int Age { get; set; }
        public string Credit_Rating { get; set; }
        public string Address { get; set; }
        public string Address2 { get; set; }
        public string State { get; set; }
        public int Zip_Code { get; set; }
        public string Area_Code { get; set; }
        public string County { get; set; }
        public string Primary_Phone { get; set; }
        public string Secondary_Phone { get; set; }
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Email { get; set; }
        public int Years_At_Address { get; set; }
        public bool Is_Currently_at_Address { get; set; }
        public string Own_Or_Rent { get; set; }
        public string Comments { get; set; }
        public string Contact_Method { get; set; }
        public DateTime Birthdate { get; set; }
        public string Occupation { get; set; }
        public string Highest_Level { get; set; }
        public string Gender { get; set; }
        public string Property_Type { get; set; }

    }
}