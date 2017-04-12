using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using Newtonsoft.Json;
using System.IO;
namespace Yi_QuoteWizard_Exercise.Models
{
    public class QuoteCollection
    {
        private List<Quote> Quotes;

        private string DataFile
        {
            get
            {
                if(string.IsNullOrEmpty(ConfigurationManager.AppSettings["JsonDataFile"]))
                {
                    return Path.Combine(HttpContext.Current.Server.MapPath("~"), "Data/auto.leads.json"); 
                }
                else
                {
                    return Path.Combine(HttpContext.Current.Server.MapPath("~"), ConfigurationManager.AppSettings["JsonDataFile"]);
                }
                
            }
        }
        public QuoteCollection()
        {
            Quotes = new List<Quote>();
            if(File.Exists( DataFile))
            {
                string JsonString = File.ReadAllText(DataFile);
                JsonSerializerSettings settings = new JsonSerializerSettings();
                settings.NullValueHandling = NullValueHandling.Ignore;
                settings.MissingMemberHandling = MissingMemberHandling.Ignore;
                Quotes = JsonConvert.DeserializeObject<List<Quote>>(JsonString,settings);
            }

        }

        public List<Quote> GetQuotes()
        {
            return Quotes;
        }

    }
}