const searchForm = document.getElementById("search-form");
const submitButton = searchForm.querySelector("button");
const dateField = searchForm.querySelector("#date-input");

submitButton.addEventListener('click', function(event) {
  event.preventDefault();

  clearBar();

  const selectedDate = document.getElementById('date-input').value;
  const date = new Date(selectedDate);

  document.getElementById('date-input').value = '';

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 91);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() - 1);

  const year = minDate.getFullYear();
  const month = String(minDate.getMonth() + 1).padStart(2, '0');
  const day = String(minDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const alertElement = document.getElementById('alert');

  if (date < minDate) {
    alertElement.textContent = 'Please enter a date after ' + formattedDate;
    alertElement.style.visibility = 'visible';
    alertElement.setAttribute('data-validation', 'true');

  } else if (date > maxDate) {
    alertElement.textContent = 'Please enter a date before yesterday';
    alertElement.style.visibility = 'visible';
    alertElement.setAttribute('data-validation', 'true');

  } else if (!selectedDate) {
    alertElement.textContent = 'Please enter a date';
    alertElement.style.visibility = 'visible';
    alertElement.setAttribute('data-validation', 'true');

  } else {
    alertElement.style.visibility = 'hidden';
    getDepartureData(selectedDate);
    getArrivalData(selectedDate);
    alertElement.setAttribute('data-validation', 'true');

  }
});

function clearBar(){  
  document.getElementById("center").style.visibility="hidden";
  const depContainer = document.getElementById("flight-statistics-departure");
  depContainer.querySelector(".info").style.visibility = "hidden";
  document.getElementById("departure-histogram").innerHTML="";
  document.getElementById("departure-histogram").style.visibility="hidden";

  const arrContainer = document.getElementById("flight-statistics-arrival");
  arrContainer.querySelector(".info").style.visibility = "hidden";
  document.getElementById("arrival-histogram").innerHTML="";
  document.getElementById("arrival-histogram").style.visibility="hidden";
  document.getElementById("arrival-ranking").querySelector('h2').visibility = "hidden";
  document.getElementById("departure-ranking").querySelector('h2').visibility = "hidden";
  document.getElementById("arrival-table").innerHTML = "";
  document.getElementById("departure-table").innerHTML = "";
}

dateField.addEventListener("focus", clearBar);

function getDepartureData(date) {
  const flightrequest =
    "flight.php?date=" +
    date +
    "&lang=en&cargo=false&arrival=false";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", flightrequest, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const data = JSON.parse(xhr.responseText);
      departureData(data);
    } else {
      console.error("Error:", xhr.status);
    }
  };

  xhr.onerror = function () {
    console.error("Request failed");
  };

  xhr.send();
}

function getArrivalData(date) {  
  const flightrequest =
  "flight.php?date=" +
  date +
  "&lang=en&cargo=false&arrival=true";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", flightrequest, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const data = JSON.parse(xhr.responseText);
      console.log(data);
      arrivalData(data);
    } else {
      console.error("Error:", xhr.status);
    }
  };

  xhr.onerror = function () {
    console.error("Request failed");
  };

  xhr.send();
}

function departureData(data) {
  const date = data[0].date;
  let flightsPerHour = {};
  let departedFlights = 0;
  flights = data[Object.keys(data).length - 1].list;
  var cancelled = 0;
  var delayed = 0;
  for (let i = 0; i < 24; i++) {
    flightsPerHour[i] = 0;
  }
  flightsPerHour["next"] = 0;

  console.log(flights);

  flights.forEach((flight) => {
    if (flight.status.startsWith("Dep")) {
      const depTime = flight.status.substr(4);
      departedFlights++;
      const hour = parseInt(depTime.split(":")[0]);
      const time = parseInt(flight.time.split(":")[0]);
      if (flight.status.match(/\((\d{2}\/\d{2}\/\d{4})\)/)){
        flightsPerHour["next"]++;
      }
      else flightsPerHour[hour]++;
    }else if (flight.status.includes("Delayed")){
      delayed++;
    }
    else{
      cancelled++;
    }
  });

  const chartContainer = document.getElementById("flight-statistics-departure");
  const info = chartContainer.querySelector(".info");
  document.querySelector("#center").textContent = "Flight Statistics on " + date;
  document.querySelector("#center").style.visibility = "visible";

  info.style.visibility = "visible";
  info.querySelector(".flight").textContent = Object.keys(flights).length;
  info.querySelector(".special").innerHTML = "<i>Cancelled: </i>" + cancelled;
  if (delayed>0){
    info.querySelector(".special").innerHTML += ", <i>Delayed: </i>" + delayed;
  }
  const destinations = rankingDeparture(flights);
  info.querySelector(".destination").innerHTML = destinations;

  const histogram = document.getElementById("departure-histogram");
  histogram.style.visibility="visible";

  for (let i = 0; i < 24; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");

    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = i.toString().padStart(2, "0");
    label.style.visibility = "visible";
    bar.appendChild(label);

    const valueBar = document.createElement("div");
    valueBar.classList.add("value");
    valueBar.style.width = `${flightsPerHour[i] * 10}px`;
    bar.appendChild(valueBar);

    const num = document.createElement("div");
    num.classList.add("num");
    if (flightsPerHour[i] != 0) num.textContent = flightsPerHour[i];
    num.style.visibility = "visible";
    bar.appendChild(num);

    histogram.appendChild(bar);
  }

  if (flightsPerHour["next"] != 0) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = "next";
    label.style.visibility = "visible";
    bar.appendChild(label);

    const valueBar = document.createElement("div");
    valueBar.classList.add("value");
    valueBar.style.width = `${flightsPerHour["next"] * 10}px`;
    bar.appendChild(valueBar);

    const num = document.createElement("div");
    num.classList.add("num");
    num.textContent = flightsPerHour["next"];
    num.style.visibility = "visible";
    bar.appendChild(num);

    histogram.appendChild(bar);
  }

  chartContainer.style.visibility = "visible";
}

function arrivalData(data) {
  const date = data[0].date;
  let flightsPerHour = {};
  let arrivedFlights = 0;
  flights = data[Object.keys(data).length - 1].list;
  var cancelled = 0;
  var delayed = 0;
  flightsPerHour["prev"] = 0;
  for (let i = 0; i < 24; i++) {
    flightsPerHour[i] = 0;
  }
  flightsPerHour["next"] = 0;
  const actualDate = new Date(date);
  
  flights.forEach((flight) => {
    if (flight.status.startsWith("At gate")) {
      const arrTime = flight.status.substr(8);
      arrivedFlights++;
      const hour = parseInt(arrTime.split(":")[0]);
      const time = parseInt(flight.time.split(":")[0]);
  
      if (flight.status.match(/\((\d{2}\/\d{2}\/\d{4})\)/)) {
        const statusDayMatch = flight.status.match(/\((\d{2}\/\d{2}\/\d{4})\)/);
        const statusDay = statusDayMatch[1];
  
        const [day, month, year] = statusDay.split("/");
        const statusDate = new Date(`${year}-${month}-${day}`);
  
        statusDate.setHours(0, 0, 0, 0);
  
        if (statusDate > actualDate) {
          flightsPerHour["next"]++;
        } else {
          flightsPerHour["prev"]++;
        }
      } else {
        flightsPerHour[hour]++;
      }
    } else if (flight.status.includes("Delayed")){
      delayed++;
    }
    else{
      cancelled++;
    }
  });

  const chartContainer = document.getElementById("flight-statistics-arrival");
  const info = chartContainer.querySelector(".info");

  info.style.visibility = "visible";
  info.querySelector(".flight").textContent = Object.keys(flights).length;
  info.querySelector(".special").innerHTML = "<i>Cancelled: </i>" + cancelled;
  if (delayed>0){
    info.querySelector(".special").innerHTML += "<i>Delayed: </i>" + delayed;
  }
  const histogram = document.getElementById("arrival-histogram");

  histogram.style.visibility="visible";

  const origins = rankingArrival(flights);
  info.querySelector(".origin").innerHTML = origins;

  if (flightsPerHour["prev"] != 0) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = "prev";
    label.style.visibility = "visible";
    bar.appendChild(label);

    const valueBar = document.createElement("div");
    valueBar.classList.add("value");
    valueBar.style.width = `${flightsPerHour["prev"] * 10}px`;
    bar.appendChild(valueBar);

    const num = document.createElement("div");
    num.classList.add("num");
    num.textContent = flightsPerHour["prev"];
    num.style.visibility = "visible";
    bar.appendChild(num);

    histogram.appendChild(bar);
  }

  for (let i = 0; i < 24; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");

    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = i.toString().padStart(2, "0");
    label.style.visibility = "visible";
    bar.appendChild(label);

    const valueBar = document.createElement("div");
    valueBar.classList.add("value");
    valueBar.style.width = `${flightsPerHour[i] * 10}px`;
    bar.appendChild(valueBar);

    const num = document.createElement("div");
    num.classList.add("num");
    if (flightsPerHour[i] != 0) num.textContent = flightsPerHour[i];
    num.style.visibility = "visible";
    bar.appendChild(num);

    histogram.appendChild(bar);
  }

  if (flightsPerHour["next"] != 0) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    const label = document.createElement("div");
    label.classList.add("label");
    label.textContent = "next";
    label.style.visibility = "visible";
    bar.appendChild(label);

    const valueBar = document.createElement("div");
    valueBar.classList.add("value");
    valueBar.style.width = `${flightsPerHour["next"] * 10}px`;
    bar.appendChild(valueBar);

    const num = document.createElement("div");
    num.classList.add("num");
    num.textContent = flightsPerHour["next"];
    num.style.visibility = "visible";
    bar.appendChild(num);

    histogram.appendChild(bar);
  }
}

function rankingDeparture(flight){
  const destinations = {};
    
  for (const flight of flights) {
    const destination = flight.destination[0];
      
    if (destinations[destination]) {
      destinations[destination]++;
    } else {
      destinations[destination] = 1;
    }
  }
    
  const uniqueDestinations = Object.keys(destinations).length;
    
  const sortedDestinations = Object.entries(destinations)
    .sort((a, b) => b[1] - a[1])
    .map(([airport, count]) => ({ airport, count }));
    
  const top10Airports = sortedDestinations.slice(0, 10);
  
  console.log(top10Airports);
  const table = document.getElementById("departure-table");
  table.style.visibility = "visible";
  table.innerHTML = '<tr><td colspan="2" style="text-align: center;"><b>Airport</b></td><td><b>No. of Flights</b></td></tr>'
  document.getElementById("departure-ranking").querySelector('h2').visibility = "visible";

  top10Airports.forEach((airport) => {
    const row = document.createElement("tr");
    row.classList.add("row");
    const code = document.createElement("td")
    code.textContent = airport.airport;
    code.style.fontWeight = "bold";
    row.appendChild(code);
    const name = document.createElement("td")
    getAirportName(airport.airport, function (airportName) {
      name.textContent = airportName;
    });    
    row.appendChild(name);
    const val = document.createElement("td");
    val.classList.add("number");
    val.textContent = airport.count;
    row.appendChild(val);
    row.style.visibility = "visible";
    table.appendChild(row);
  });

  return uniqueDestinations;
}

function rankingArrival(flights) {
  const origins = {};

  for (const flight of flights) {
    const origin = flight.origin[0];

    if (origins[origin]) {
      origins[origin]++;
    } else {
      origins[origin] = 1;
    }
  }

  const uniqueOrigins = Object.keys(origins).length;

  const sortedOrigins = Object.entries(origins)
    .sort((a, b) => b[1] - a[1])
    .map(([airport, count]) => ({ airport, count }));

  const top10Airports = sortedOrigins.slice(0, 10);
  const table = document.getElementById("arrival-table");

  table.innerHTML = '<tr class = "row"><td colspan="2" style="text-align: center;"><b>Airport</b></td><td><b>No. of Flights</b></td></tr>'
  document.getElementById("arrival-ranking").querySelector('h2').visibility = "visible";

  console.log(top10Airports);
  table.style.visibility = "visible";
  top10Airports.forEach((airport) => {
    const row = document.createElement("tr");
    row.classList.add("row");
    const code = document.createElement("td");
    code.textContent = airport.airport;
    code.style.fontWeight = "bold";
    row.appendChild(code);
    const name = document.createElement("td");
    getAirportName(airport.airport, function (airportName) {
      name.textContent = airportName;
    });
    row.appendChild(name);
    const val = document.createElement("td");
    val.textContent = airport.count;
    row.appendChild(val);
    row.style.visibility = "visible";
    table.appendChild(row);
  });

  return uniqueOrigins;
}


function getAirportName(iata, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "iata.json", true);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const data = JSON.parse(xhr.responseText);
      let name = ""; // Initialize the name variable
      for (let i = 0; i < data.length; i++) {
        if (data[i].iata_code === iata) {
          name = data[i].name;
          break;
        }
      }
      callback(name);
    } else {
      console.error("Error:", xhr.status);
    }
  };

  xhr.onerror = function () {
    console.error("Request failed");
  };

  xhr.send();
}
