

function GetFilter()
{
    $('<div>', { id: 'FilterDiv', html: "<table><tr id='FilterContainer'></tr><tr id='FilterFooter'></tr></table>" }).appendTo($("body"));
    $('<td>', { html: "Former Insurer <select multiple='multiple'  id='FIDDL'>" }).appendTo($("#FilterContainer"));
    $('<td>', { html: "Make <select multiple='multiple'  id='VMDDL'>" }).appendTo($("#FilterContainer"));
    $('<td>', { html: "State <select multiple='multiple'  id='STDDL'>" }).appendTo($("#FilterContainer"));
    $('<td>', { html: "<button id='BtnApply' type='button'>Apply</button>" }).appendTo($("#FilterFooter"));
    $.getJSON('api/GetFilters')
        .done(function (data) {
            $.each(data.Vehicle_Make, function (key, item) {
                $('<option>', { text: item.Key, value: item.Key, 'selected': 'selected'}).appendTo($('#VMDDL'));
            });
            $('#VMDDL').pqSelect({
                multiplePlaceholder: 'Select Make',
                displayText: "{0} Vehicle Make(s) selected",
                maxDisplay: 2,
                search: false,
                width: 300,
                checkbox: true //adds checkbox to options    
            });
            $.each(data.State, function (key, item) {
                $('<option>', { text: item.Key, value: item.Key,'selected':'selected' }).appendTo($('#STDDL'));
            });
            $('#STDDL').pqSelect({
                multiplePlaceholder: 'Select State',
                displayText: "{0} State(s) selected",
                maxDisplay: 2,
                search: false,
                width: 300,
                checkbox: true //adds checkbox to options    
            });
            $.each(data.Former_Insurer, function (key, item) {
                $('<option>', { text: item.Key, value: item.Key, 'selected': 'selected' }).appendTo($('#FIDDL'));
            });
            $('#FIDDL').pqSelect({
                multiplePlaceholder: 'Select Former Insurer',
                displayText: "{0} Former Insurer(s) selected",
                maxDisplay: 2,
                search: false,
                width: 300,
                checkbox: true //adds checkbox to options    
            });
            $('#BtnApply').click(function () {
                GetQuotes();
            });

            GetQuotes();
        })
        .fail(function (jqXHR, textStatus, err) {
            alert(jqXHR);
        });

   
}

function GetQuotes()
{
    $('#QuoteDiv').remove();
    var filter = { Former_Insurer: [], State: [], Vehicle_Make: [] };

    $.each($('#VMDDL').val(), function (key, item) {
        filter.Vehicle_Make.push({ Key: item, Value: item });
    });
    $.each($('#STDDL').val(), function (key, item) {
        filter.State.push({ Key: item, Value: item });
    });
    $.each($('#FIDDL').val(), function (key, item) {
        filter.Former_Insurer.push({ Key: item, Value: item });
    });

    $.ajax({
        type: "POST",
        data: JSON.stringify(filter),
        url: "api/GetQuote",
        contentType: "application/json"
    }).done(function (data) {

        $('<div>', {id:'QuoteDiv', html: "<table id='QuoteContainer' class='QuoteTable'></table>" }).appendTo($("body"));
        
        CurrentPage = 1;
        TotalPages = Math.ceil(data.length / MAXITEMPERPAGE);
        PopulateGridTable(data, $('#QuoteContainer'), 0, MAXITEMPERPAGE);

        if (data.length > MAXITEMPERPAGE)
        {
            $('<div>', { html: "<table class='QuoteTableFooter'><tr><td><button id='prevbtn' style='float:left;'><</button></td><td class='FooterPageNum'><input id='PageNumTB' class='PageNumTB' type='text' value='" + CurrentPage + "'/> / " + TotalPages + "</td><td><button id='nextbtn' style='float:right;'>></button></td></tr></table>" }).appendTo($('#QuoteDiv'));
            $('#prevbtn').click(function () {
                CurrentPage--;
                PopulateGridTable(data, $('#QuoteContainer'), (CurrentPage-1) * MAXITEMPERPAGE );
                if (CurrentPage == 1) {
                    $('#prevbtn').attr("disabled", 'disabled');
                }
                else {
                    $('#prevbtn').removeAttr("disabled");
                }
                $('#PageNumTB').val(CurrentPage);
                $('#nextbtn').removeAttr("disabled");
            });
            $('#nextbtn').click(function () {
                CurrentPage++;
                PopulateGridTable(data, $('#QuoteContainer'), (CurrentPage - 1) * MAXITEMPERPAGE);
                if (CurrentPage == TotalPages) {
                    $('#nextbtn').attr("disabled", 'disabled');
                }
                else {
                    $('#nextbtn').removeAttr("disabled");
                }
                $('#PageNumTB').val(CurrentPage);
                $('#prevbtn').removeAttr("disabled");
            });
            $('#PageNumTB').change(function () {
                var pagenum = $(this).val();
                if (pagenum < 1)
                    pagenum = 1;
                else if (pagenum > TotalPages)
                    pagenum = TotalPages;

                CurrentPage = pagenum;
                PopulateGridTable(data, $('#QuoteContainer'), (CurrentPage - 1) * MAXITEMPERPAGE);
                if (CurrentPage == 1) {
                    $('#prevbtn').attr("disabled", 'disabled');
                    $('#nextbtn').removeAttr("disabled");
                }
                else if (CurrentPage == TotalPages) {
                    $('#prevbtn').removeAttr("disabled");
                    $('#nextbtn').attr("disabled", 'disabled');
                }
                else {
                    $('#prevbtn').removeAttr("disabled");
                    $('#nextbtn').removeAttr("disabled");
                }
            });
            $('#prevbtn').attr("disabled", 'disabled');
        }

    }).fail(function (jqXHR, textStatus, err) {
            alert(err);
        });

}

function PopulateGridTable(Quotes,Container,startindex)
{
    Container.empty();
    $('<tr>', { html: "<th>Quote ID</th><th>Consumer</th><th>State</th>" }).appendTo(Container);
    for (i = startindex; i < startindex + MAXITEMPERPAGE; i++) {
        if (Quotes[i]) {
            var item = Quotes[i];
            var link = "<a target='_blank' href='QuoteDetail.html?qid=" + item.ID+"'>"+ item.ID+"</a>"

            $('<tr>', { html: "<td>" + link + "</td><td>" + item.Consumer.First_Name + " " + item.Consumer.Last_Name + "</td><td>" + item.Consumer.State + "</td>" }).appendTo(Container);
        }
    }
   
}

function DisplayQuote() {
    var QID = getParameterByName('qid');
    $.getJSON('api/GetQuote/'+QID)
        .done(function (data) {
            $('<h1>', { html: "Quote ID: " + data.ID }).appendTo($("body"));
            $('<div>', { html: "Consumer: " + data.Consumer.First_Name + " " + data.Consumer.Last_Name, class: 'SectionTitle'}).appendTo($("body"));
            $('<div>', { html: "<table id='ConsumerContainer' class='DetailTable'></table>" }).appendTo($("body"));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Age</td><td>" +data.Consumer.Age + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Credit rating</td><td>" + GetString(data.Consumer.Credit_Rating) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Address</td><td>" + GetString(data.Consumer.Address) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Address2</td><td>" + GetString(data.Consumer.Address2)+ "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>State</td><td>" + GetString(data.Consumer.State) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Zip Code</td><td>" + data.Consumer.Zip_Code + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Area Code</td><td>" + GetInt(data.Consumer.Area_Code) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>County</td><td>" + GetString(data.Consumer.County) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Primary Phone</td><td>" + GetString(data.Consumer.Primary_Phone)+ "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Secondary Phone</td><td>" + GetString(data.Consumer.Secondary_Phone) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Email</td><td>" + GetString(data.Consumer.Email) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Years at address</td><td>" + data.Consumer.Years_At_Address + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Is currently at address</td><td>" + GetString(data.Consumer.Is_Currently_at_Address) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Own or rent</td><td>" + GetString(data.Consumer.Own_Or_Rent) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Comments</td><td>" + GetString(data.Consumer.Comments) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Contact Method</td><td>" + GetString(data.Consumer.Contact_Method) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Birthdate</td><td>" + GetDateString(data.Consumer.Birthdate) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Occupation</td><td>" + GetString(data.Consumer.Occupation) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Highest Level</td><td>" + GetString(data.Consumer.Highest_Level) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Gender</td><td>" + GetString(data.Consumer.Gender) + "</td>" }).appendTo($('#ConsumerContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Property Type</td><td>" + GetString(data.Consumer.Property_Type) + "</td>" }).appendTo($('#ConsumerContainer'));


            $.each(data.Vehicle, function (key, item) {
                $('<div>', { html: "Vehicle: " + item.Make + " " + item.Model,class:'SectionTitle' }).appendTo($("body"));
                $('<div>', { html: "<table id='VehicleContainer" + key +"' class='DetailTable'></table>" }).appendTo($("body"));
                $('<tr>', { html: "<td class='DetailTableNameTD'>Year</td><td>" + item.Year + "</td>" }).appendTo($('#VehicleContainer' + key));
                $('<tr>', { html: "<td class='DetailTableNameTD'>Days used</td><td>" + item.Days_Used + "</td>" }).appendTo($('#VehicleContainer' + key));
                $('<tr>', { html: "<td class='DetailTableNameTD'>Use</td><td>" + GetString(item.Use) + "</td>" }).appendTo($('#VehicleContainer' + key));
                $('<tr>', { html: "<td class='DetailTableNameTD'>Distance</td><td>" + item.Distance + "</td>" }).appendTo($('#VehicleContainer' + key));
                $('<tr>', { html: "<td class='DetailTableNameTD'>Annual distance</td><td>" + item.Annual_Distance + "</td>" }).appendTo($('#VehicleContainer' + key));
                $('<tr>', { html: "<td class='DetailTableNameTD'>EngineInformation</td><td>" + GetString(item.EngineInformation) + "</td>" }).appendTo($('#VehicleContainer' + key));

            });
           
            $('<div>', { html: "Coverage", class: 'SectionTitle' }).appendTo($("body"));
            $('<div>', { html: "<table id='CoverageContainer' class='DetailTable'></table>" }).appendTo($("body"));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Mouths_Insured</td><td>" + GetString(data.Coverage.Mouths_Insured) + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Has_Coverage</td><td>" + GetString(data.Coverage.Has_Coverage) + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Type</td><td>" + GetString(data.Coverage.Type) + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Bodily injury person</td><td>" + data.Coverage.Bodilyinjury_person + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Bodily injury accident</td><td>" + data.Coverage.Bodilyinjury_accident + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Deductible</td><td>" + data.Coverage.Deductible + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Property damage</td><td>" + data.Coverage.Propertydamage + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Expiration Date</td><td>" + GetDateString(data.Coverage.Expiration_Date) + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Expiration Days Remaining</td><td>" + data.Coverage.Expiration_Days_Remaining + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>DtgExpirationDate</td><td>" + GetDateString(data.Coverage.DtgExpirationDate) + "</td>" }).appendTo($('#CoverageContainer'));
            $('<tr>', { html: "<td class='DetailTableNameTD'>Former Insurer</td><td>" + GetString(data.Coverage.Former_Insurer) + "</td>" }).appendTo($('#CoverageContainer'));
            
        })
        .fail(function (jqXHR, textStatus, err) {
            alert(jqXHR);
        });
}
function GetDateString(date) {
    var timestring = new Date(date.split(/T/)[0].replace(/-/g, '/'));
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    if (timestring.getYear() <= 1 || timestring == "NaN")
        return "N/A";
    else
        return (timestring.getMonth() + 1) + "/" + timestring.getDate() + "/" + timestring.getFullYear();
}

function GetString(data) {
    if (data && data.length > 0)
        return data;
    else
        return "N/A";

}

function GetInt(data) {
    if (data)
        return data;
    else
        return "N/A";

}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}