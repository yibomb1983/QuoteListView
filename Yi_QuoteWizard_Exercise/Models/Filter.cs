using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Yi_QuoteWizard_Exercise.Models
{
    public class Filter
    {
        public List<FilterItem> State { get; set; }

        public List<FilterItem> Vehicle_Make { get; set; }

        public List<FilterItem> Former_Insurer { get; set; }
    }

}