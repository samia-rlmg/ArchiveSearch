//Query spreadsheet and return HTML table

//Load packages
google.charts.load('current', {'packages':['table']});

//Set Google Sheets unique key
var gsKey = "1LST9-FQj7HKwGB3TyyaUay4fMpS7-B4_0fafC_EOGlY";

$("input").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#btn").click();
  }
});

// $('input').on('keypress', (event) ==> {
//   if(event.which === 13) {
//     $("#btn").click();
//   }
// })

//Use user-entered search terms to define search variables
function defineSearch() {
  //Set variables based on user input
  var searchTerms = $("#search-terms").val();
  var andOperator = $("#andLogic").is(":checked");
  var orOperator = $("#orLogic").is(":checked");

  //Set operator based on user input
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
  formulateQuery(searchTerms, operator);

}

//Formulate a query for Google Sheets based on user-entered search terms
function formulateQuery(searchTerms, operator) {

    //Initialize a string that will hold the query sent to Google Sheets
    var queryArr = [];

    //If search terms are set, add them all to the query.
    if (searchTerms) {
      var searchTermArr = searchTerms.split(',');
      searchTermArr = trimArray(searchTermArr);

      var subQueryArr = [];
      for (i=0;i<searchTermArr.length;i++) {
        // NOTE: Exclude any columns with dates or other non-text formats\
        subQueryArr.push("lower(A) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(B) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(C) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(O) contains lower('"+searchTermArr[i]+"')");
        subQueryArr.push("lower(J) contains lower('"+searchTermArr[i]+"')");

      if (subQueryArr) {
        queryArr.push(subQueryArr.join(" OR "));
      }
    }

    }

    var gsQuery;

    //If no search terms are set, print a log message.
    if (!searchTerms) {
      console.log("No search terms set");
      gsQuery = "SELECT *";
    } else {
      gsQuery = "SELECT * WHERE "+queryArr.join(" "+operator+" ");
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
    console.log ("Error sending query");
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();

  var cssClassNames = {tableCell: 'table-cell'};
  var options = {'cssClassNames': cssClassNames, 'showRowNumber': false, 'width': '100%', 'allowHtml': true};

  if ((JSON.stringify(data)).includes('[]')) {
    alert("No entries match your search.")
  } else {
    var hdTable = new google.visualization.Table(document.getElementById('showData'));

    var formatter = new google.visualization.PatternFormat();

    data.setProperty(0,9,'style','width:400px');

    hdTable.draw(data, options);
    $( ".table-cell" ).wrapInner( "<div class='table-div'></div>");
  }
}

function trimArray(arr) {
  for(i=0;i<arr.length;i++)
  {
      arr[i] = arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  return arr;
}
