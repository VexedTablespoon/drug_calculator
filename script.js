document.addEventListener("DOMContentLoaded", () => {
    updateCurrentDateTime();
    setDefaultDateValues();
    loadStoredItems();
    setInterval(updateCurrentDateTime, 1000);
});

function updateCurrentDateTime() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB');
    const formattedTime = now.toLocaleTimeString('en-GB', { hour12: false });
    document.getElementById('currentDateTime').innerText = `${formattedDate} ${formattedTime}`;
}

function setDefaultDateValues() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("drugRemovalDate").value = today;
    document.getElementById("ivFluidWarmDate").value = today;
}

function addDrug() {
    const drugName = document.getElementById("drugName").value.trim();
    const drugDuration = document.getElementById("drugDuration").value;
    const drugDurationUnit = document.getElementById("drugDurationUnit").value;
    const drugRemovalDate = document.getElementById("drugRemovalDate").value || new Date().toISOString().split('T')[0];

    if (drugName && drugDuration) {
        const drugItem = {
            name: drugName,
            duration: drugDuration,
            unit: drugDurationUnit,
            removalDate: drugRemovalDate
        };
        storeDrugItem(drugItem);
        document.getElementById("drugName").value = '';
        document.getElementById("drugDuration").value = '';
        document.getElementById("drugRemovalDate").value = new Date().toISOString().split('T')[0];
        loadStoredItems(); // Refresh the list
    }
}

function storeDrugItem(drugItem) {
    const storedDrugs = JSON.parse(localStorage.getItem("drugsList")) || [];
    storedDrugs.push(drugItem);
    localStorage.setItem("drugsList", JSON.stringify(storedDrugs));
}

function addIvFluid() {
    const ivFluidName = document.getElementById("ivFluidName").value.trim();
    const ivFluidDuration = document.getElementById("ivFluidDuration").value;
    const ivFluidDurationUnit = document.getElementById("ivFluidDurationUnit").value;
    const ivFluidWarmDate = document.getElementById("ivFluidWarmDate").value || new Date().toISOString().split('T')[0];

    if (ivFluidName && ivFluidDuration) {
        const ivFluidItem = {
            name: ivFluidName,
            duration: ivFluidDuration,
            unit: ivFluidDurationUnit,
            warmDate: ivFluidWarmDate
        };
        storeIvFluidItem(ivFluidItem);
        document.getElementById("ivFluidName").value = '';
        document.getElementById("ivFluidDuration").value = '';
        document.getElementById("ivFluidWarmDate").value = new Date().toISOString().split('T')[0];
        loadStoredItems(); // Refresh the list
    }
}

function storeIvFluidItem(ivFluidItem) {
    const storedIvFluids = JSON.parse(localStorage.getItem("ivFluidsList")) || [];
    storedIvFluids.push(ivFluidItem);
    localStorage.setItem("ivFluidsList", JSON.stringify(storedIvFluids));
}

function calculateExpiryDate(startDate, duration, unit) {
    const date = new Date(startDate);
    if (unit === 'days') {
        date.setDate(date.getDate() + parseInt(duration));
    } else if (unit === 'weeks') {
        date.setDate(date.getDate() + parseInt(duration) * 7);
    } else if (unit === 'months') {
        date.setMonth(date.getMonth() + parseInt(duration));
    }
    return date;
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function loadStoredItems() {
    const storedDrugs = JSON.parse(localStorage.getItem("drugsList")) || [];
    document.getElementById("drugsList").innerHTML = '';
    storedDrugs.forEach(drugItem => addDrugToList(drugItem));

    const storedIvFluids = JSON.parse(localStorage.getItem("ivFluidsList")) || [];
    document.getElementById("ivFluidsList").innerHTML = '';
    storedIvFluids.forEach(ivFluidItem => addIvFluidToList(ivFluidItem));
}

function addDrugToList(drugItem) {
    const expiryDate = calculateExpiryDate(new Date(), drugItem.duration, drugItem.unit); // Use current date for expiry calculation
    const formattedExpiryDate = formatDate(expiryDate);
    const drugElement = document.createElement('div');
    drugElement.classList.add('item');
    drugElement.innerHTML = `
        <strong>${drugItem.name}</strong><br>
        Expiry Date: <span class="expiry">${formattedExpiryDate}</span><br>
        <button onclick="removeItem(this)">Remove</button>
    `;
    document.getElementById("drugsList").appendChild(drugElement);
    sortDrugsList();
}

function addIvFluidToList(ivFluidItem) {
    const expiryDate = calculateExpiryDate(new Date(), ivFluidItem.duration, ivFluidItem.unit); // Use current date for expiry calculation
    const formattedExpiryDate = formatDate(expiryDate);
    const ivFluidElement = document.createElement('div');
    ivFluidElement.classList.add('item');
    ivFluidElement.innerHTML = `
        <strong>${ivFluidItem.name}</strong><br>
        Expiry Date: <span class="expiry">${formattedExpiryDate}</span><br>
        <button onclick="removeItem(this)">Remove</button>
    `;
    document.getElementById("ivFluidsList").appendChild(ivFluidElement);
    sortIvFluidsList();
}

function sortDrugsList() {
    const drugsList = document.getElementById("drugsList");
    const drugItems = Array.from(drugsList.children);
    drugItems.sort((a, b) => a.querySelector("strong").innerText.localeCompare(b.querySelector("strong").innerText));
    drugsList.innerHTML = '';
    drugItems.forEach(item => drugsList.appendChild(item));
}

function sortIvFluidsList() {
    const ivFluidsList = document.getElementById("ivFluidsList");
    const ivFluidItems = Array.from(ivFluidsList.children);
    ivFluidItems.sort((a, b) => a.querySelector("strong").innerText.localeCompare(b.querySelector("strong").innerText));
    ivFluidsList.innerHTML = '';
    ivFluidItems.forEach(item => ivFluidsList.appendChild(item));
}

function removeItem(button) {
    if (confirm('Are you sure you want to remove this item?')) {
        const itemElement = button.parentElement;
        const itemName = itemElement.querySelector("strong").innerText;
        const drugsList = JSON.parse(localStorage.getItem("drugsList")) || [];
        const updatedDrugsList = drugsList.filter(drug => drug.name !== itemName);
        localStorage.setItem("drugsList", JSON.stringify(updatedDrugsList));

        const ivFluidsList = JSON.parse(localStorage.getItem("ivFluidsList")) || [];
        const updatedIvFluidsList = ivFluidsList.filter(ivFluid => ivFluid.name !== itemName);
        localStorage.setItem("ivFluidsList", JSON.stringify(updatedIvFluidsList));

        itemElement.remove();
    }
}
