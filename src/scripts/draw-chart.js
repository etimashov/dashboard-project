import './chart.min.js';
import { Chart } from './chart.min.js';
import _ from 'underscore';

function getSalesFigures(value, index, list) {
    return value.salesTotal;
}

function getYearSalesFigures(value, index, list) {
    return value.currentValue;
}

function getDayName(value) {
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return weekday[value.date.getDay()];
}

function drawLineChart(labels, values, title, id) {
    const ctx = document.getElementById(id).getContext('2d');
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
              label: title,
              data: values,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
        }
    };
    const myChart = new Chart(ctx, config);
}

export function drawSalesWeekChart(data) {
    const labels = _.map(data, getDayName);
    const curWeekSales = _.map(data, getSalesFigures);
    drawLineChart(labels, curWeekSales, 'Last 7 days sales, RUB', 'sales-week-chart');
}

export function drawSalesYearChart(data) {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const yearSales = _.map(data.report_orders_dynamic_1.annuallyData, getYearSalesFigures);
    drawLineChart(labels, yearSales, 'Current year sales, RUB', 'sales-year-chart');
}