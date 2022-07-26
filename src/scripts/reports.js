const channelsID = {
    Yandex: "Яндекс.Маркет",
    Ozon: "OZON",
    Wildberries: "WILDBERRIES"
}

//Calculate orders and total sum by sales channel ID. Paid orders only
function calcChannelOrders(data, id) {
    let itemsNumber = 0;
    let otherItemsNumber = 0;
    let salesAmount = 0;
    let otherSalesAmount = 0;

    data.forEach(item => {
        if (item.paymentStatus === "PAID") {
            if (item.delivery.title === channelsID[id]) {
                itemsNumber++;
                salesAmount += item.totalOrderSum;
            }
            else if ((item.delivery.title === "СДЭК") || (item.delivery.title === "Boxberry") || (item.delivery.title === "X5")) {
                otherItemsNumber++;
                otherSalesAmount += item.totalOrderSum;
            }
        }
    });

    if (channelsID[id] === undefined) {
        return {orders: otherItemsNumber,
                total: otherSalesAmount};
    } else {
        return {orders: itemsNumber,
            total: salesAmount};;
    }
}

//TODO: rewrite for last 7 days. Now displaying current week sales
function getWeekSalesTotal(data) {
    return data.report_sales_sum_1.week;
}

function getTodaySalesTotal(data) {
    return data.report_sales_sum_1.today;
}

//TODO: rewrite for last 7 days. Now displaying current week sales
function getWeekOrdersTotal(data) {
    return data.report_orders_sum_1.week;
}

function getTodayOrdersTotal(data) {
    return data.report_orders_sum_1.today;
}

export function displayWeekSales(data) {
    const content = document.getElementById('sales-week');
    content.innerHTML = `<span class="key-data">${getWeekSalesTotal(data)}</span> RUB<br><span class="small">last 7 days sales<span>`;
}

export function displayWeekOrders(data) {
    const content = document.getElementById('orders-week');
    content.innerHTML = `<span class="key-data">${getWeekOrdersTotal(data)}</span><br><span class="small">last 7 days orders<span>`;
}

export function displayTodaySales(data) {
    const content = document.getElementById('sales-today');
    content.innerHTML = `<span class="key-data">${getTodaySalesTotal(data)}</span> RUB<br><span class="small">sales today<span>`;
}

export function displayTodayOrders(data) {
    const content = document.getElementById('orders-today');
    content.innerHTML = `<span class="key-data">${getTodayOrdersTotal(data)}</span><br><span class="small">orders today<span>`;
}

export function displayChannelSales(data, id, channelName) {
    const content = document.getElementById(id);
    const channelData = calcChannelOrders(data, channelName);
    content.innerHTML = `<span class="key-data">${channelData.orders}</span><span class="small"> orders</span><br><span class="key-data">${Math.round(channelData.total)}</span> RUB<br>${channelName}`;
}