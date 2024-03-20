# flight-statistics-web-application

Flight Statistics Web App
This is a web application designed to retrieve and display passenger flight statistics from Hong Kong Airport Open Data. The app utilizes a REST web service provided by HK Airport, which returns historical flight data in JSON format. The primary function of the app is to showcase passenger flight statistics for a specific date selected by the user. The interface is user-friendly and compatible with both mobile platforms and desktop computers.

The web app is built using the data provided by the Airport Authority (HKAA). You can access the data and download the data dictionary from the HKAA Team 1 Flight Information dataset.

Development Requirements
To run the web app locally, you need to set up a web server and place the following files in the public_html folder:

flight.php: A program that acts as a proxy to fetch flight data from the Hong Kong Airport server due to CORS limitations.
iata.json: A JSON file containing descriptive information about airports.
styles.css: CSS file for styling the web app.
main.js: JavaScript file for implementing the app's functionality.
index.html: The main HTML file serving as the base document of the web app.

How to Use
Clone the repository.
Set up a web server (e.g., Apache) and configure it to serve the public_html folder.
Access the web app through the web server's URL.
Enter/select a valid date within the specified range (Today-91 to Yesterday) in the search form.
Click the "Search" button to retrieve and display the flight statistics for the selected date.
Explore the displayed information, including departure and arrival flight counts, special cases, histograms, and top destination/origin airports.

Resources
HKAA Team 1 Flight Information - Hong Kong Airport Open Data
Flight Information Data Dictionary - Data dictionary for request parameters and response data set.
flight.php - A PHP program acting as a proxy for fetching flight data.
iata.json - JSON file containing descriptive information about airports.
styles.css - CSS file for styling the web app.
main.js - JavaScript file containing the app's functionality.
index.html - The main HTML file serving as the base document of the web app.
