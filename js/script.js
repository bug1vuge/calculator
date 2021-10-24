const mainTitle = document.getElementsByTagName('h1')[0];

const handlStartBtn = document.getElementsByClassName('handler_btn')[0];
const handlResetBtn = document.getElementsByClassName('handler_btn')[1];

const addBtn = document.querySelector('.screen-btn');

const percentOtherItems = document.querySelectorAll('.other-items.percent');
const numberOtherItems = document.querySelectorAll('.other-items.number');
const otherItems = document.querySelectorAll('.other-items')


const rollbackInput = document.querySelector('.rollback > .main-controls__range > [type="range"]');
const rollbackSpan = document.querySelector('.rollback > .main-controls__range > .range-value');

const total = document.getElementsByClassName('total-input')[0];
const totalCount = document.getElementsByClassName('total-input')[1];
const totalCountOther = document.getElementsByClassName('total-input')[2];
const fullTotalCount = document.getElementsByClassName('total-input')[3];
const totalCountRollback = document.getElementsByClassName('total-input')[4];
const totalInputs = document.querySelectorAll('.total-input');


let screenItems = document.querySelectorAll('.screen');

const selectList = document.querySelector('.screen > .main-controls__select > select');
const screensAmountInput = document.querySelector('.screen > .main-controls__input > input');

const appData = {
    screens: [],

    servicesPercent: {},
    servicesNumber: {},

    servicePricesPercent: 0,
    servicePricesNumber: 0,

    screenPrice: 0,
    fullPrice: 0,
    rollback: 0,
    priceWithRollback: 0,
    screenNumber: 0,

    addTitle: function () {
        document.title = mainTitle.textContent;
    },
    addScreenBlock: function () {
        const cloneScreen = screenItems[0].cloneNode(true);
        screenItems[screenItems.length - 1].after(cloneScreen);
    },


    addScreens: function () {
        screenItems = document.querySelectorAll('.screen');

        screenItems.forEach((screen, index) => {
            const select = screen.querySelector('select');
            const input = screen.querySelector('input');
            const selectName = select.options[select.selectedIndex].textContent;


            this.screens.push({
                id: index,
                name: selectName,
                price: +select.value * +input.value,
                count: +input.value
            })
        });

    },
    addServices: function () {
        percentOtherItems.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                this.servicesPercent[label.textContent] = +input.value;
            }

        });

        numberOtherItems.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');

            if (check.checked) {
                this.servicesNumber[label.textContent] = +input.value;
            }
        });
    },
    addPrices: function () {

        for (let screen of this.screens) {
            this.screenPrice += +screen.price;
        }

        for (let screen of this.screens) {
            this.screenNumber += screen.count;
        }

        for (let key in this.servicesNumber) {
            this.servicePricesNumber += this.servicesNumber[key];
        }

        for (let key in this.servicesPercent) {
            this.servicePricesPercent += this.screenPrice * (this.servicesPercent[key] / 100);
        }

        this.fullPrice = +this.screenPrice + this.servicePricesPercent + this.servicePricesNumber;
        this.priceWithRollback = (this.fullPrice * this.rollback) + this.fullPrice;
    },

    showResult: function () {
        total.value = this.screenPrice;
        totalCountOther.value = this.servicePricesPercent + this.servicePricesNumber;
        fullTotalCount.value = this.fullPrice;
        totalCountRollback.value = this.priceWithRollback;
        totalCount.value = this.screenNumber;
    },

    checkingValue: function () {
        handlStartBtn.disabled = true;

        screenItems.forEach((item) => {
            item.addEventListener('input', () => {
                const selectValue = selectList.value;
                const inputValue = screensAmountInput.value;
                if (selectValue !== '' && inputValue !== '') {
                    handlStartBtn.disabled = false;
                }
            });
        });
    },

    gettingRollback: function () {
        rollbackSpan.textContent = rollbackInput.value + '%';
        this.rollback = rollbackInput.value / 100;
    },

    disableElements: function () {

        screenItems.forEach((item) => {
            const select = item.querySelector('select');
            const input = item.querySelector('input');

            select.disabled = true;
            input.disabled = true;
        });

        addBtn.disabled = true;

        otherItems.forEach((item) => {
            const check = item.querySelector('.custom-checkbox');
            check.disabled = true;
        })

        rollbackInput.disabled = true;

        handlStartBtn.style.display = 'none';
        handlResetBtn.style.display = 'block';
    },

    enableElements: function () {
        handlStartBtn.style.display = 'block';
        handlResetBtn.style.display = 'none';

        screenItems.forEach((item) => {
            const select = item.querySelector('select');
            const input = item.querySelector('input');

            select.disabled = false;
            input.disabled = false;

            if (select.value !== '' && input.value !== '') {
                select.value = '';
                input.value = '';
            }
        });

        addBtn.disabled = false;

        otherItems.forEach((item) => {
            const check = item.querySelector('.custom-checkbox');

            if (check.checked) {
                check.checked = false;
            }
            check.disabled = false;
        })


    },

    clearFiedls: function () {

        screenItems.forEach((item) => {
            const select = item.querySelector('select');
            const input = item.querySelector('input');

            if (select.value !== '' && input.value !== '') {
                select.value = '';
                input.value = '';
            }
        });

        const removeBlock = () => {
            for (let i = 1; i < screenItems.length; i++) {
                screenItems[i].remove();
            }
        };

        const clearInputValue = () => {
            total.value = '0';
            totalCountOther.value = '0';
            fullTotalCount.value = '0';
            totalCountRollback.value = '0';
            totalCount.value = '0';
        }

        const changingRollbackValue = () => {
            rollbackInput.disabled = false;
            rollbackInput.value = '0';
            rollbackSpan.textContent = rollbackInput.value + '%';
        }

        removeBlock();
        clearInputValue();
        changingRollbackValue();
    },

    reset: function () {
        this.enableElements();
        this.clearFiedls();
    },

    start: function () {

        this.addScreens();
        this.addServices();
        this.addPrices();
        this.showResult();

        this.disableElements();
    },

    init: function () {
        appData.checkingValue();

        appData.addTitle();
        handlStartBtn.addEventListener('click', () => {
            this.start.call(appData);
        });
        addBtn.addEventListener('click', () => {
            this.addScreenBlock.call(appData)
        });
        rollbackInput.addEventListener('input', () => {
            this.gettingRollback.call(appData);
        });
        handlResetBtn.addEventListener('click', () => {
            this.reset.call(appData);
        });
    },

};

appData.init();


