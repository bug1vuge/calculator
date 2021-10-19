const mainTitle = document.getElementsByTagName('h1')[0];

const handlStartBtn = document.getElementsByClassName('handler_btn')[0];
const handlResetBtn = document.getElementsByClassName('handler_btn')[1];

const addBtn = document.querySelector('.screen-btn');

const percentOtherItems = document.querySelectorAll('.other-items.percent');
const numberOtherItems = document.querySelectorAll('.other-items.number');

const rollbackInput = document.querySelector('.rollback > .main-controls__range > [type="range"]');
const rollbackSpan = document.querySelector('.rollback > .main-controls__range > .range-value');

const total = document.getElementsByClassName('total-input')[0];
const totalCount = document.getElementsByClassName('total-input')[1];
const totalCountOther = document.getElementsByClassName('total-input')[2];
const fullTotalCount = document.getElementsByClassName('total-input')[3];
const totalCountRollback = document.getElementsByClassName('total-input')[4];

let screenItems = document.querySelectorAll('.screen');

const appData = {
    screens: [],

    servicesPercent: {},
    servicesNumber: {},

    servicePricesPercent: 0,
    servicePricesNumber: 0,

    screenPrice: 0,
    fullPrice: 0,

    init: function () {
        appData.addTitle();

        handlStartBtn.addEventListener('click', appData.start);
        addBtn.addEventListener('click', appData.addScreenBlock)
    },

    addTitle: function () {
        document.title = mainTitle.textContent;
    },

    addScreens: function () {

        screenItems = document.querySelectorAll('.screen');

        screenItems.forEach(function (screen, index) {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');
            const selectName = select.options[select.selectedIndex].textContent;

            appData.screens.push({
                id: index,
                name: selectName,
                price: +select.value * +input.value
            })
        });
    },

    addScreenBlock: function () {
        const cloneScreen = screenItems[0].cloneNode(true);
        screenItems[screenItems.length - 1].after(cloneScreen);
    },

    addServices: function () {
        percentOtherItems.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                appData.servicesPercent[label.textContent] = +input.value;
            }
        });

        numberOtherItems.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                appData.servicesNumber[label.textContent] = +input.value;
            }
        });
    },

    addPrices: function () {

        for (let screen of appData.screens) {
            appData.screenPrice += +screen.price;
        }

        for (let key in appData.servicesNumber) {
            appData.servicePricesNumber += appData.servicesNumber[key];
        }

        for (let key in appData.servicesPercent) {
            appData.servicePricesPercent += appData.screenPrice * (appData.servicesPercent[key] / 100);
        }

        appData.fullPrice = +appData.screenPrice + appData.servicePricesPercent + appData.servicePricesNumber;
    },

    showResult: function () {
        total.value = appData.screenPrice;
        totalCountOther.value = appData.servicePricesPercent + appData.servicePricesNumber;
        fullTotalCount.value = appData.fullPrice;
    },

    start: function () {
        appData.addScreens();
        appData.addServices();
        appData.addPrices();
        appData.showResult();
    },
};

appData.init();


