//Query spreadsheet and return HTML table

//Load packages
google.charts.load('current', {'packages':['table']});

//Set Google Sheets unique key
var gsKey = "1LST9-FQj7HKwGB3TyyaUay4fMpS7-B4_0fafC_EOGlY";

//Use user-entered search terms to define search variables
function defineSearch() {
  //Set variables based on user input
  var driveNo = $("#driveNo").val();
  var project = $("#project").val();
  var keywords = $("#keywords").val();
  var producer = $("#producer-editor").val();
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
  formulateQuery(driveNo, project, keywords, producer, operator);

}

//Formulate a query for Google Sheets based on user-entered search terms
function formulateQuery(driveNo, project, keywords, producer, operator) {

    //Initialize a string that will hold the query sent to Google Sheets
    var queryArr = [];

    //If a project search term is set, add it to the query.
    if (driveNo) {
      queryArr.push("(lower(A) contains lower('"+driveNo+"'))");
    }

    if (project) {
      queryArr.push("(lower(B) contains lower('"+project+"'))");
    }

    //If keywords and a project are set, add them all to the query.
    if (keywords) {
      var keywordArr = keywords.split(',');
      keywordArr = trimArray(keywordArr);

      for (i=0;i<keywordArr.length;i++) {
        queryArr.push("(lower(J) contains lower('"+keywordArr[i]+"')) ");
      }
    }

    //If a producer and either project or keywords are set, add it to the query.
    if (producer) {
      queryArr.push("(lower(O) contains lower('"+producer+"'))");
    }

    if (queryArr) {
      console.log("Query pieces: "+queryArr.join(" "+operator+" "));
    }

    var gsQuery;

    //If no search terms are set, print a log message.
    if (!(driveNo) && !(project) && !(keywords) && !(producer)) {
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
  var dataClean = JSON.stringify(data, null, 4).replace(/\\/g, "");
  var dataClean = `{"cols":
  [
      {"id":"A",
      "label":"Hard Drive Number",
      "type":"string"},
      {"id":"B","label":"Project","type":"string"},
      {"id":"C","label":"Format","type":"string"},
      {"id":"D","label":"Pixel Size","type":"string"},
      {"id":"E","label":"Start Date","type":"date","pattern":"m/d/yyyy"},
      {"id":"F","label":"End Date","type":"date","pattern":"m/d/yyyy"},
      {"id":"G","label":"Editing Version","type":"string"},
      {"id":"H","label":"File Folder Name","type":"string"},
      {"id":"I","label":"Final File Format","type":"string"},
      {"id":"J","label":"Keywords","type":"string"},
      {"id":"K","label":"Location of Files","type":"string"},
      {"id":"L","label":"LTO Tape","type":"string"},
      {"id":"M","label":"Notes","type":"string"},
      {"id":"N","label":"Original File Format","type":"string"},
      {"id":"O","label":"Producer/Editor","type":"string"},
      {"id":"P","label":"Raw Footage","type":"string"},
      {"id":"Q","label":"Description of Raw Footage","type":"string"},
      {"id":"R","label":"Preview Link","type":"string"}
    ],

  "rows":
    [
      {"v":"CAL 001"},
      {"v":"Denver Museum of Nature and Science"},
      {"v":"JPEG"},
      {"v":"LARGE"},
      {"v":"Date(2010, 5, 28)","f":"6/28/2010"},
      {"v":"Date(2013, 8, 12)","f":"9/12/2013"},
      null,
      {"v":"Hi Res Still at DMNS"},
      null,
      null,
      null,
      {"v":"LTO 001"},
      {"v":"Publicity stills taken by Design Firm of final installation"},
      null,
      null,
      null,
      null,
      {"v":"preview"}
    ],
    [
      {"v":"CAL 001"},
      {"v":"Denver Museum of Nature and Science"},
      {"v":"JPEG"},
      {"v":"LARGE"},
      {"v":"Date(2010, 5, 28)","f":"6/28/2010"},
      {"v":"Date(2013, 8, 12)","f":"9/12/2013"},
      null,
      {"v":"Hi Res Still at DMNS"},
      null,
      null,
      null,
      {"v":"LTO 001"},
      {"v":"Publicity stills taken by Design Firm of final installation"},
      null,
      null,
      null,
      null,
      {"v":"preview"}
    ]
  }`
  //var dataObj = JSON.parse(dataClean);
  //console.log(dataClean);

  //This is for making a table without Google visualization; can cut

  // var keys = Object.keys(data);
  // console.log("Keys: " + Object.keys(dataObj));
  // var col = [];
  //   for (var i = 0; i < keys.length; i++) {
  //     console.log(JSON.stringify(dataObj));
  //       for (var key in keys[i]) {
  //         if (col.indexOf(key) === -1) {
  //           col.push(key);
  //         }
  //       }
  //   }
  // console.log("Columns: " + col);

  //end cuttable section

  var cssClassNames = {tableCell: 'table-cell'};
  var options = {'cssClassNames': cssClassNames, 'showRowNumber': false, 'width': '100%', 'allowHtml': true};

  var hdTable = new google.visualization.Table(document.getElementById('showData'));

  var formatter = new google.visualization.PatternFormat();

  data.setProperty(2,9,'style','width:400px');

  hdTable.draw(data, options);
  $( ".table-cell" ).wrapInner( "<div class='table-div'></div>");
}

function trimArray(arr) {
  for(i=0;i<arr.length;i++)
  {
      arr[i] = arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  return arr;
}
