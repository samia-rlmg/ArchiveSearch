//Query spreadsheet and return HTML table

//Load packages
google.charts.load('current', {'packages':['table']});

//Set Google Sheets unique key
var gsKey = "1LST9-FQj7HKwGB3TyyaUay4fMpS7-B4_0fafC_EOGlY";

var project;
var keywords;
var producer;

function defineSearch() {
  var project = $("project").val();
  $("lblProject").html(project);

  var keywords = $("keywords").val();
  var producer = $("producer").val();
  console.log("Called defineSearch()");
}

var button = window.document.getElementById("btn");
button.onclick = function() {

  //Formulate query
  var gsQuery;

  //If a project search term is set, add it to the query.
  if (project) {
    gsQuery = "SELECT R,A,B,F,H,J,O WHERE (B contains '"+project+"')";
  }

  //If keywords and a project are set, add them all to the query.
  if (keywords && project) {
      var argument = "";
      for (i=0;i<keywords.length;i++) {
        if (i < keywords.length-1) {
        argument = argument + "(J contains '"+keywords[i]+"') OR ";
      } else {
        argument = argument + "(J contains '"+keywords[i]+"')";
      }
    }
    gsQuery = gsQuery + " OR " + argument;
  } else if (keywords) {  //If no project is set but keywords are, add them to the query.
    for (i=0;i<keywords.length;i++) {
     var argument = "(J contains '"+keywords[i]+"')"
     if (i < keywords.length) {
       gsQuery = "SELECT R,A,B,F,H,J,O WHERE "+argument;
     } else {
       gsQuery = "SELECT R,A,B,F,H,J,O WHERE "+argument;
     }
   }
  }

  //If a producer and either project or keywords are set, add it to the query.
  if ((producer) && ((project) || (keywords))) {
    gsQuery = gsQuery + " OR (O contains '"+producer+"')";
  } else if (producer) { //If only the producer is set, add it to the query.
    gsQuery = "SELECT R,A,B,F,H,J,O WHERE (O contains '"+producer+"')";
  }

  //If no search terms are set, print a log message.
  if (!(project || keywords || producer)) {
    console.log("No search terms set");
    gsQuery = "SELECT R,A,B,F,H,J,O";
  }

  console.log("Formulated query: "+gsQuery);

  var query = new google.visualization.Query(
        'http://spreadsheets.google.com/tq?key='+gsKey+'&gid=0');

    // Apply query language.
    query.setQuery(gsQuery);

    // Send the query with a callback function.
    query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();
  console.log(JSON.stringify(data, null, 4));
  var hdTable = new google.visualization.Table(document.getElementById('showData'));

  var formatter = new google.visualization.PatternFormat();

  hdTable.draw(data, {showRowNumber: false, width: '100%', height: '100%', allowHtml: true});

}
