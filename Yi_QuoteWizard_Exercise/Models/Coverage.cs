using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Yi_QuoteWizard_Exercise.Models
{
    public class Coverage
    {
        public int Mouths_Insured { get; set; }
        public string Has_Coverage { get; set; }
        public string Type { get; set; }
        public int Bodilyinjury_person { get; set; }
        public int Bodilyinjury_accident { get; set; }
        public int Deductible { get; set; }
        public int Propertydamage { get; set; }
        public DateTime Expiration_Date { get; set; }
        public int Expiration_Days_Remaining { get; set; }
        public DateTime DtgExpirationDate { get; set; }
        public string Former_Insurer { get; set; }
    }
}