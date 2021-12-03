var tickers = ["AAPL", "TSLA", "CRSR", "NEE", "X:ETHUSD"];
$(document).ready(function() {
  for (const ticker of tickers) {
    $.ajax({
      url: "https://api.polygon.io/v2/aggs/ticker/" + ticker + "/prev",
      method: "GET",
      data: {
        "adjusted": "true",
        "apikey": "XtJU7khhsdVPsX1jQPx_p1VpF4p0Uzdz"
      }
    }).done(function(data) {
      var change = Math.round((((data.results[0].c - data.results[0].o) / data.results[0].c) * 100) * 100) / 100;
      var textColor = "text-danger";
      if (change > 0) {
        textColor = "text-success"
      }
      $("#tableBody").append("<tr><td>" + data.results[0].T + "</td>" +
        "<td>" + data.results[0].o + "</td>" +
        "<td>" + data.results[0].c + "</td>" +
        "<td class=" + textColor + ">" + change + "</td>" + "</tr>")
    }).fail(function(data) {
      $("#tableBody").append("<tr><td>API Error. Please wait a minute and refresh the page</td></tr>");
      console.log(data.responseJSON.error);
    })
  }
})
