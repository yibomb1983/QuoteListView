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
                //Getting the Jason Data file from web config or use default value
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

                //create Serializtion setting for convertion between Json string to Object
                JsonSerializerSettings settings = new JsonSerializerSettings();
                settings.NullValueHandling = NullValueHandling.Ignore;
                settings.MissingMemberHandling = MissingMemberHandling.Ignore;
                try
                {
                    Quotes = JsonConvert.DeserializeObject<List<Quote>>(JsonString, settings);
                }
                catch (Exception e)
                {
                    //Throw expection for error handling
                }
            }

        }
        public QuoteCollection(string FileName)
        {
            Quotes = new List<Quote>();
            if (File.Exists(FileName))
            {
                string JsonString = File.ReadAllText(FileName);
                //create Serializtion setting for convertion between Json string to Object
                JsonSerializerSettings settings = new JsonSerializerSettings();
                settings.NullValueHandling = NullValueHandling.Ignore;
                settings.MissingMemberHandling = MissingMemberHandling.Ignore;
                try
                {
                    Quotes = JsonConvert.DeserializeObject<List<Quote>>(JsonString, settings);
                }
                catch(Exception e)
                {
                    //Throw expection for error handling
                }

            }

        }
        public List<Quote> GetQuotes()
        {
            return Quotes;
        }

    }
}