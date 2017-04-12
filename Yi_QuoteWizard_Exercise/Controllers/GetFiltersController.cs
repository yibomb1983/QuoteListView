using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Yi_QuoteWizard_Exercise.Models;

namespace Yi_QuoteWizard_Exercise.Controllers
{
    public class GetFiltersController : ApiController
    {
        [HttpGet]
        [ActionName(" GetFilters")]
        public Filter GetFilters()
        {
            //initializing filter object
            Filter filter = new Filter();
            filter.Former_Insurer = new List<FilterItem>();
            filter.State = new List<FilterItem>();
            filter.Vehicle_Make = new List<FilterItem>();

            // Create Quote Data from the file
            QuoteCollection quotes = new QuoteCollection();

            //initializing filter dictionary for faster search of dulplicate values
            Dictionary<string, string> former_Insurer = new Dictionary<string, string>();
            Dictionary<string, string> State = new Dictionary<string, string>();
            Dictionary<string, string> Vehicle_Make = new Dictionary<string, string>();

            // Populate Filter values
            foreach (Quote q in quotes.GetQuotes())
            {
                //check if dictionary has key, if it does already then no insert
                if (!former_Insurer.ContainsKey(q.Coverage.Former_Insurer))
                    former_Insurer.Add(q.Coverage.Former_Insurer, q.Coverage.Former_Insurer);
                if (!State.ContainsKey(q.Consumer.State))
                    State.Add(q.Consumer.State, q.Consumer.State);
                
                foreach(Vehicle v in q.Vehicle)
                {
                    FilterItem VM = new FilterItem();
                    VM.Value = v.Make;
                    VM.Key = v.Make;
                    if (!Vehicle_Make.ContainsKey(v.Make))
                        Vehicle_Make.Add(v.Make, v.Make);
                }
            }

            //Convert Dictionary back to Lists
            PopulateFilterList(former_Insurer, filter.Former_Insurer);
            PopulateFilterList(State, filter.State);
            PopulateFilterList(Vehicle_Make, filter.Vehicle_Make);

            //Sort List for better user exprience
            filter.Former_Insurer = filter.Former_Insurer.OrderBy(fi => fi.Value).ToList();
            filter.State = filter.State.OrderBy(fi => fi.Value).ToList();
            filter.Vehicle_Make = filter.Vehicle_Make.OrderBy(fi => fi.Value).ToList();

            return filter;
        }

        private void PopulateFilterList(Dictionary<string,string> dic,List<FilterItem> filterlist )
        {
            foreach (KeyValuePair<string, string> kv in dic)
            {
                FilterItem fi = new FilterItem();
                // since there are empty string, so replace it with N/A as place holder
                if (!string.IsNullOrEmpty(kv.Key))
                {
                   
                    fi.Key = kv.Key;
                    fi.Value = kv.Value;
                }
                else
                {
                    fi.Key = "N/A";
                    fi.Value = "N/A";
                }

                filterlist.Add(fi);

            }

        }

    }
}