document.addEventListener("DOMContentLoaded", () => {
    updateCurrentDateTime();
    loadStoredItems(); // Load items and calculate expiry dates on app open
    setInterval(updateCurrentDateTime, 1000);
});

function updateCurrentDateTime() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB');
    const formattedTime = now.toLocaleTimeString('en-GB', { hour12: false });
    document.getElementById('currentDateTime').innerText = `${formattedDate} ${formattedTime}`;
}

function loadStoredItems() {
    const storedDrugs = JSON.parse(localStorage.getItem("drugsList")) || [];
    document.getElementById("drugsList").innerHTML = '';
    storedDrugs.forEach(drugItem => {
        const expiryDate = calculateExpiryDate(new Date(), drugItem.duration, drugItem.unit);
        addDrugToList(drugItem, expiryDate);
    });

    const storedIvFluids = JSON.parse(localStorage.getItem("ivFluidsList")) || [];
    document.getElementById("ivFluidsList").innerHTML = '';
    storedIvFluids.forEach(ivFluidItem => {
        const expiryDate = calculateExpiryDate(new Date(), ivFluidItem.duration, ivFluidItem.unit);
        addIvFluidToList(ivFluidItem, expiryDate);
    });
}

function calculateExpiryDate(currentDate, duration, unit) {
    const date = new Date(currentDate);
    if (unit === 'days') {
        date.setDate(date.getDate() + parseInt(duration));
    } else if (unit === 'weeks') {
        date.setDate(date.getDate() + parseInt(duration) * 7);
    } else if (unit === 'months') {
        date.setMonth(date.getMonth() + parseInt(duration));
    }
    return date;
}

function addDrug() {
    const drugName = document.getElementById("drugName").value.trim();
    const drugDuration = document.getElementById("drugDuration").value;
    const drugDurationUnit = document.getElementById("drugDurationUnit").value;

    if (drugName && drugDuration) {
        const drugItem = {
            name: drugName,
            duration: drugDuration,
            unit: drugDurationUnit
        };
        storeDrugItem(drugItem);
        document.getElementById("drugName").value = '';
        document.getElementById("drugDuration").value = '';
        loadStoredItems(); // Refresh the list
    }
}

function addDrugToList(drugItem, expiryDate) {
    const formattedExpiryDate = formatDate(expiryDate);
    const drugElement = document.createElement('div');
    drugElement.classList.add('item');
    drugElement.innerHTML = `
        <strong>${drugItem.name}</strong><br>
        Expiry Date: <span class="expiry" style="color: red;">${formattedExpiryDate}</span><br>
        <button onclick="removeItem(this)">Remove</button>
    `;
    document.getElementById("drugsList").appendChild(drugElement);
}

function addIvFluid() {
    const ivFluidName = document.getElementById("ivFluidName").value.trim();
    const ivFluidDuration = document.getElementById("ivFluidDuration").value;
    const ivFluidDurationUnit = document.getElementById("ivFluidDurationUnit").value;

    if (ivFluidName && ivFluidDuration) {
        const ivFluidItem = {
            name: ivFluidName,
            duration: ivFluidDuration,
            unit: ivFluidDurationUnit
        };
        storeIvFluidItem(ivFluidItem);
        document.getElementById("ivFluidName").value = '';
        document.getElementById("ivFluidDuration").value = '';
        loadStoredItems(); // Refresh the list
    }
}

function addIvFluidToList(ivFluidItem, expiryDate) {
    const formattedExpiryDate = formatDate(expiryDate);
    const ivFluidElement = document.createElement('div');
    ivFluidElement.classList.add('item');
    ivFluidElement.innerHTML = `
        <strong>${ivFluidItem.name}</strong><br>
        Expiry Date: <span class="expiry" style="color: red;">${formattedExpiryDate}</span><br>
        <button onclick="removeItem(this)">Remove</button>
    `;
    document.getElementById("ivFluidsList").appendChild(ivFluidElement);
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function storeDrugItem(drugItem) {
    const storedDrugs = JSON.parse(localStorage.getItem("drugsList")) || [];
    storedDrugs.push(drugItem);
    localStorage.setItem("drugsList", JSON.stringify(storedDrugs));
}

function storeIvFluidItem(ivFluidItem) {
    const storedIvFluids = JSON.parse(localStorage.getItem("ivFluidsList")) || [];
    storedIvFluids.push(ivFluidItem);
    localStorage.setItem("ivFluidsList", JSON.stringify(storedIvFluids));
}

function removeItem(button) {
    if (confirm('Are you sure you want to remove this item?')) {
        const itemElement = button.parentElement;
        const itemName = itemElement.querySelector("strong").innerText;
        let storedDrugs = JSON.parse(localStorage.getItem("drugsList")) || [];
        let storedIvFluids = JSON.parse(localStorage.getItem("ivFluidsList")) || [];

        storedDrugs = storedDrugs.filter(drug => drug.name !== itemName);
        storedIvFluids = storedIvFluids.filter(ivFluid => ivFluid.name !== itemName);

        localStorage.setItem("drugsList", JSON.stringify(storedDrugs));
        localStorage.setItem("ivFluidsList", JSON.stringify(storedIvFluids));

        itemElement.remove();
    }
}
