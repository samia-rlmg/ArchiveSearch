//Query spreadsheet and return HTML table

//Load packages
google.charts.load('current', {'packages':['table']});

//Set Google Sheets unique key
var gsKey = "1LST9-FQj7HKwGB3TyyaUay4fMpS7-B4_0fafC_EOGlY";

// var project;
// var keywords;
// var producer;

//Use user-entered search terms to define search variables
function defineSearch() {
  //Set variables based on user input
  var driveNo = $("#driveNo").val();
  var project = $("#project").val();
  var keywords = $("#keywords").val();
  var producer = $("#producer-editor").val();
  var andOperator = $("#andLogic").is(":checked");
  var orOperator = $("#orLogic").is(":checked");

  var operator;
  if (andOperator===true) {
    operator = "AND";
  } else if (orOperator===true) {
    operator = "OR";
  } else {
    console.log("No operator chosen")
    operator = "OR";
  }

  console.log("Operator: "+operator);

  //Call the function that will formulate a query for Google Sheets
  formulateQuery(driveNo, project, keywords, producer, operator);

}

//Formulate a query for Google Sheets based on user-entered search terms
function formulateQuery(driveNo, project, keywords, producer, operator) {

    //Initialize a string that will hold the query sent to Google Sheets
    var gsQuery;
    var queryArr;

    //If a project search term is set, add it to the query.
    if (project) {
      gsQuery = "SELECT * WHERE (lower(B) contains lower('"+project+"'))";
    }

    //If keywords and a project are set, add them all to the query.
    if (keywords) {
      var keywordArr = keywords.split(',');
      keywordArr = trimArray(keywordArr);

      var argument = "";
      for (i=0;i<keywordArr.length;i++) {
        if (i < keywordArr.length-1) {
          argument = argument + "(lower(J) contains lower('"+keywordArr[i]+"')) "+operator+" ";
        } else if (i == keywordArr.length - 1) {
          argument = argument + "(lower(J) contains lower('"+keywordArr[i]+"'))"
        }
      }
    }

    if (keywords && project) {
        //Add the new piece to the existing query
        gsQuery = gsQuery + " "+operator+" " + argument;
    } else if (keywords) {  //If no project is set but keywords are, add them to the query.
      for (i=0;i<keywords.length;i++) {
        console.log("Keywords: "+keywordArr.toString());
        //argument = "(lower(J) contains lower('"+keywords[i]+"'))"
        gsQuery = "SELECT * WHERE "+argument;
     }
    }

    //If a producer and either project or keywords are set, add it to the query.
    if ((producer) && ((project) || (keywords))) {
      gsQuery = gsQuery + " " + operator + " (lower(O) contains lower('"+producer+"'))";
    } else if (producer) { //If only the producer is set, add it to the query.
      gsQuery = "SELECT * WHERE (lower(O) contains lower('"+producer+"'))";
    }

    //If no search terms are set, print a log message.
    if (!(project) && !(keywords) && !(producer)) {
      console.log("No search terms set");
      gsQuery = "SELECT *";
    }

    console.log("Formulated query: "+gsQuery);

    var query = new google.visualization.Query(
          'http://spreadsheets.google.com/tq?key='+gsKey+'&gid=0');

      // gsQuery = "SELECT * WHERE lower(B) contains lower('denver')";

      // Apply query language.
      query.setQuery(gsQuery);

      // Send the query with a callback function.
      query.send(handleQueryResponse);
  }

function handleQueryResponse(response) {
  if (response.isError()) {
    console.log ("Error sending query");
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();
  console.log(JSON.stringify(data, null, 4));
  var hdTable = new google.visualization.Table(document.getElementById('showData'));

  var formatter = new google.visualization.PatternFormat();

  hdTable.draw(data, {showRowNumber: false, width: '100%', allowHtml: true});
}

function trimArray(arr) {
  for(i=0;i<arr.length;i++)
  {
      arr[i] = arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  return arr;
}
