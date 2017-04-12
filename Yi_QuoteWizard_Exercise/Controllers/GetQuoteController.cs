using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Yi_QuoteWizard_Exercise.Models;

namespace Yi_QuoteWizard_Exercise.Controllers
{
    public class GetQuoteController : ApiController
    {
        [HttpGet]
        [ActionName("GetQuote")]
        public Quote Get(int ID)
        {

            Quote Result = new Quote();
            QuoteCollection quotes = new QuoteCollection();
            Result = quotes.GetQuotes().Where(q => q.ID == ID).FirstOrDefault();
            
            return Result;
        }

        [HttpPost]
        [ActionName("GetQuote")]
        public List<Quote> GetQuote([FromBody] Filter filter)
        {

            List<Quote> Result = new List<Quote>();

            QuoteCollection quotes = new QuoteCollection();
            Result = quotes.GetQuotes();
            Result = ApplyFilter(Result, filter.State, 1);
            Result = ApplyFilter(Result, filter.Former_Insurer, 2);
            Result = ApplyFilter(Result, filter.Vehicle_Make, 3);

            Result = Result.OrderBy(q => q.ID).ToList();
            return Result;
        }
        

        private List<Quote> ApplyFilter (List<Quote> Quotes,  List<FilterItem> filters,int filtertype)
        {
            List<string> filterlist = new List<string>();

            foreach (FilterItem fi in filters)
            {
                if(fi.Key == "N/A")
                    filterlist.Add(string.Empty);
                else
                    filterlist.Add(fi.Key);
            }
            List<Quote> filteredList = new List<Quote>();
            if(filtertype == 1)
            {
                filteredList = Quotes.Where(q => filterlist.Contains(q.Consumer.State)).ToList();
            }
            else if(filtertype == 2)
            {
                filteredList = Quotes.Where(q => filterlist.Contains(q.Coverage.Former_Insurer)).ToList();
            }
            else if (filtertype == 3)
            {
                filteredList = Quotes.Where(q => q.Vehicle.Where(v=> filterlist.Contains(v.Make)).Count()>0).ToList();
            }

            return filteredList;
        }
        
    }
}