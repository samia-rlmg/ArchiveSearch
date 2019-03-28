//Query spreadsheet and return HTML table

//Load packages
google.charts.load('current', {'packages':['table']});

//Set Google Sheets unique key
var gsKey = "1LST9-FQj7HKwGB3TyyaUay4fMpS7-B4_0fafC_EOGlY";

// Make "Enter" trigger the submit button
$("input").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#btn").click();
  }
});

//Use user-entered search terms to define search variables
function defineSearch() {
  //Set variables based on user input
  var searchTerms = $("#search-terms").val();
  var searchTermArr = searchTerms.split(',');
  searchTermArr = trimArray(searchTermArr);
  getJSON(searchTermArr);

}

function getJSON(searchTermArr) {

  // Get spreadsheet data in JSON format
  const xhr = new XMLHttpRequest();
  const url='https://spreadsheets.google.com/feeds/list/'+gsKey+'/1/public/full?alt=json';
  xhr.open("GET", url);
  xhr.send();
  xhr.onreadystatechange=(e)=>{
    var sheetObj = JSON.parse(xhr.responseText);
    makeTable(sheetObj);

  }

  function makeTable(jsObj) {
    // Header row
    var txt = "<table id='archive-entries'><tr id='table-title'><td>ENTRIES</td><td></td><td></td><td></td></tr><tr><td><br></td></tr>";
    var content;

    // Fill in table contents
    for (i=0; i<jsObj.feed.entry.length; i++) {
      content += jsObj.feed.entry[i].gsx$projectname.$t;
      content += jsObj.feed.entry[i].gsx$drivenumber.$t;
      content += jsObj.feed.entry[i].gsx$companycode.$t;
      content += jsObj.feed.entry[i].gsx$ltonumber.$t;
      content += jsObj.feed.entry[i].gsx$drivecontents.$t;
      content += jsObj.feed.entry[i].gsx$projectmanagersproducers.$t;
      content += jsObj.feed.entry[i].gsx$featuredexhibits.$t;

      var hit = 0;
      for (j=0; j<searchTermArr.length; j++) {
        if (content.includes(searchTermArr[j])) {
          hit = 1;
        }
      }

      if (hit == 1 || searchTermArr == []) {
          // First row
          txt += "<div class='table-entry'><tr>";
          txt += "<td><span class='project-name'>"+jsObj.feed.entry[i].gsx$projectname.$t+"</span>";
          txt += "<span class='drive-no'> | Drive #"+jsObj.feed.entry[i].gsx$drivenumber.$t+"</span></td>";
          txt += "<td></td><td></td>"
          txt += "<td class='company-code'>"+jsObj.feed.entry[i].gsx$companycode.$t+"</td></tr></div>";

          // Second row
          txt += "<tr><td><span>"+jsObj.feed.entry[i].gsx$projectstartdate.$t+" – </span>";
          txt += "<span>"+jsObj.feed.entry[i].gsx$projectenddate.$t+"</span></td>";
          txt += "<td></td><td></td>"
          txt += "<td class='lto-no'>LTO Tape " + jsObj.feed.entry[i].gsx$ltonumber.$t + "</td></tr>"

          // Third row
          txt += "<tr><td><a href="+jsObj.feed.entry[i].gsx$vimeoalbumlink.$t+">"+jsObj.feed.entry[i].gsx$vimeoalbumlink.$t+"</a></td></tr>";
          txt += "<tr><td><br></td></tr>"

          // Fourth row
          txt += "<tr><td class='heading'>Drive Contents</td>"
          txt += "<td class='heading'>Project Specs</td>"
          txt += "<td class='heading'>Project Manager(s) / Producer(s)</td>"
          txt += "<td class='heading'>Featured Exhibits</td></tr>"

          // Fifth row
          txt += "<tr><td>"+jsObj.feed.entry[i].gsx$drivecontents.$t+"</td>";
          txt += "<td>"+jsObj.feed.entry[i].gsx$projectspecs.$t+"</td>";
          txt += "<td>"+jsObj.feed.entry[i].gsx$projectmanagersproducers.$t+"</td>";
          txt += "<td>"+jsObj.feed.entry[i].gsx$featuredexhibits.$t+"</td></tr>";
          txt += "<tr><td><br></td><td></td><td></td><td></td></tr>"
          txt += "<tr class='last-row'><td><br></td><td></td><td></td><td></td></tr>"
          txt += "</tr></div>";
        }

      }

    txt += "</table>";
    document.getElementById("showData").innerHTML = txt;
  }

  //When the user clicks on the button, toggle between hiding and showing the dropdown content
  document.getElementById("dropbtn").addEventListener("click", toggle);

  function toggle() {
    document.getElementById("sortDropdown").classList.toggle("show");
  }

  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('#dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  document.getElementById("sort-project").addEventListener("click", function() {
    sortTable("sort-project");
  });

  function sortTable(sortOn) {
    console.log("Made it to sortTable");
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("archive-entries");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = document.getElementsByClassName('table-entry');
      console.log(rows[i]);
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        console.log(rows[i].getElementsByTagName("TD"));
        x = rows[i].getElementsByTagName("TD")[0];
        y = rows[i + 1].getElementsByTagName("TD")[0];
        //xval = rows[i].getElementById(sortOn);
        console.log("rows[i]: "+rows[i].getElementsByTagName("TD")[0]);
        //yval = rows[i + 1].getElementById(sortOn);
        // Check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
  }
}

}
//     var query = new google.visualization.Query(
//           'http://spreadsheets.google.com/tq?key='+gsKey+'&gid=0');
//
//       // Apply query language.
//       query.setQuery(gsQuery);
//
//       // Send the query with a callback function.
//       query.send(handleQueryResponse);
//   }
//
// function handleQueryResponse(response) {
//   if (response.isError()) {
//     console.log ("Error sending query");
//     alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
//     return;
//   }
//
//   var data = response.getDataTable();
//
//   // Add a class (table-cell) to each table cell so they can be accessed directly
//   var cssClassNames = {tableCell: 'table-cell'};
//   var options = {'cssClassNames': cssClassNames, 'showRowNumber': false, 'width': '100%', 'allowHtml': true};
//
//   // Only proceed if the search returns at least one row
//   if ((JSON.stringify(data)).includes('[]')) { //Any search with no results will return an empty array of rows
//     alert("No entries match your search.")
//   } else {
//     var hdTable = new google.visualization.Table(document.getElementById('showData'));
//
//     // var formatter = new google.visualization.PatternFormat(); //Can use this to format content of cells
//
//     //data.setProperty(0,9,'style','width:400px'); //This appears to be getting overridden
//
//     // Create a table with the returned rows
//     hdTable.draw(data, options);
//     $( ".table-cell" ).wrapInner( "<div class='table-div'></div>"); //Wrap them in a div with a specific class so they can be formatted directly
//   }
// }

// Trim the leading and trailing white space out of each array item
function trimArray(arr) {
  for(i=0;i<arr.length;i++)
  {
      arr[i] = arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  return arr;
}
