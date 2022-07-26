import '../css/style.css';
import '../css/dashboard.css';
import { displayTodayOrders, displayTodaySales, displayWeekOrders, displayWeekSales, displayChannelSales } from './reports.js';
import { drawSalesWeekChart, drawSalesYearChart } from './draw-chart';

var salesData = [];

//API URLs
const requestURL = "https://app.kak2c.ru";
const authURL = "/api/lite/auth";
const dashboardURL = "/api/lite/reports";
const ordersURL = "/api/lite/orders";

//Authorization token
var authToken = null;

//Authorization data
const authData = {};

//Reports in JSON format
var reportsData = null;
var ordersData = null;

//Universal function for sending request to API
const sendRequest = function (method, url, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url);

        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json');
        if (token !== null) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }

        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        }

        xhr.onerror = () => {
            reject(xhr.response);
        }

        xhr.send(JSON.stringify(data));
    });
}

async function getAuthToken() {
    const res = await sendRequest('POST', requestURL + authURL, authData);
    return res.access_token;
} 

//Calculate last week start date and time. 
function calcDaysAgoDate(daysAgo) {
    const todayDate = new Date();
    const prevDate = new Date(todayDate.getTime() - ((daysAgo - 1) * 24 * 60 * 60 * 1000));
    return dateToString(prevDate);
    //2020-02-19T12:35:31
}

//Returns date in following format string: 'YYYY-MM-DDT00:00:00'
function dateToString(date) {
    const fullMonth = ("0" + (date.getMonth() + 1)).slice(-2);
    const fullDay = ("0" + date.getDate()).slice(-2);
    return `${date.getFullYear()}-${fullMonth}-${fullDay}T00:00:00`;
}

//Fills salesData array with information about last 'period' days sales according to data dataset
function calcSalesData(period, data) {
    //Create array of dates for the 'period' days
    const todayDate = new Date();

    Array.from({length: period}).forEach((item, i) => {
        salesData.push({date: new Date(todayDate.getTime() - ((period - i) * 24 * 60 * 60 * 1000))});
    });

    //Calculating total sales for each day
    salesData.forEach((item, index, list) => {
        let curDate = dateToString(item.date).slice(0, -9);
        let curSalesTotal = 0;

        data.forEach(dataItem => {
            if (dataItem.date.includes(curDate)) {
                curSalesTotal += dataItem.totalOrderSum;
            }
        });

        list[index].salesTotal = curSalesTotal;
    });
}

function checkAuthorization() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const hash = urlParams.get('hash');
    if (hash === process.env.HASH) {
        authData.login = process.env.API_LOGIN;
        authData.password = process.env.API_PASSWORD;
        return true;
    }
    return false;
}

//Authorize and get reports in JSON
async function init() {
    if (checkAuthorization()) {
        //Waiting for auth token
        authToken = await getAuthToken();

        //Requesting API reports
        sendRequest('GET', requestURL + dashboardURL, null, authToken)
            .then(reports => {
                reportsData = reports;
                
                //Displaying data from API reports
                displayTodaySales(reportsData);
                displayTodayOrders(reportsData);
                displayWeekSales(reportsData);
                displayWeekOrders(reportsData);

                //Drawing monthly sales chart for current year
                drawSalesYearChart(reportsData);
            })
            .catch(err => {
                console.log(err);
            });

        //Requesting today sales data
        sendRequest('GET', requestURL + ordersURL + "?date_from=" + calcDaysAgoDate(1) + "&page=0&size=100", null, authToken)
            .then(orders => {
                ordersData = orders;

                //Displaying today sales data by channels
                displayChannelSales(ordersData, "today-online", "Website");
                displayChannelSales(ordersData, "today-wildberries", "Wildberries");
                displayChannelSales(ordersData, "today-ozon", "Ozon");
                displayChannelSales(ordersData, "today-yandex", "Yandex");
            })
            .catch(err => {
                console.log(err);
            });
        
        //Request last 7 days sales data
        sendRequest('GET', requestURL + ordersURL + "?date_from=" + calcDaysAgoDate(7) + "&page=0&size=100", null, authToken)
            .then(orders => {
                ordersData = orders;

                //Displaying last 7 days sales data by channels
                displayChannelSales(ordersData, "online", "Website");
                displayChannelSales(ordersData, "wildberries", "Wildberries");
                displayChannelSales(ordersData, "ozon", "Ozon");
                displayChannelSales(ordersData, "yandex", "Yandex");

                //Calculating and drawing last 7 days total sales data
                calcSalesData(7, ordersData.orders);
                drawSalesWeekChart(salesData);
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        console.log('Authorization failed!');
        //TODO: display demo data
    }
}


init();