using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Yi_QuoteWizard_Exercise.Models
{
    public class Quote
    {
       public int ID { get; set; }
        public Consumer Consumer { get; set; }
        public List<Vehicle> Vehicle { get; set; }
        public Coverage Coverage { get; set; }
      
    }

    
}