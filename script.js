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
    const storedIvFluids = JSON.parse(localStorage.getItem("ivFluidsList")) || [];

    // Sort drugs and fluids alphabetically
    storedDrugs.sort((a, b) => a.name.localeCompare(b.name));
    storedIvFluids.sort((a, b) => a.name.localeCompare(b.name));

    // Clear and repopulate lists
    document.getElementById("drugsList").innerHTML = '';
    storedDrugs.forEach(drugItem => {
        const expiryDate = calculateExpiryDate(new Date(), drugItem.duration, drugItem.unit);
        addDrugToList(drugItem, expiryDate);
    });

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
    const drugRemovalDate = document.getElementById("drugRemovalDate").value || new Date().toISOString().split('T')[0];

    if (drugName && drugDuration && drugDurationUnit) {
        const drugItem = {
            name: drugName,
            duration: drugDuration,
            unit: drugDurationUnit,
            removalDate: drugRemovalDate
        };
        storeDrugItem(drugItem);
        document.getElementById("drugName").value = '';
        document.getElementById("drugDuration").value = '';
        document.getElementById("drugDurationUnit").value = '';
        document.getElementById("drugRemovalDate").value = '';
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
    const ivFluidWarmDate = document.getElementById("ivFluidWarmDate").value || new Date().toISOString().split('T')[0];

    if (ivFluidName && ivFluidDuration && ivFluidDurationUnit) {
        const ivFluidItem = {
            name: ivFluidName,
            duration: ivFluidDuration,
            unit: ivFluidDurationUnit,
            warmDate: ivFluidWarmDate
        };
        storeIvFluidItem(ivFluidItem);
        document.getElementById("ivFluidName").value = '';
        document.getElementById("ivFluidDuration").value = '';
        document.getElementById("ivFluidDurationUnit").value = '';
        document.getElementById("ivFluidWarmDate").value = '';
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
    const itemElement = button.parentElement;
    const itemName = itemElement.querySelector("strong").innerText;
    const isDrug = itemElement.closest('#drugsList') !== null;

    const itemType = isDrug ? 'drug' : 'fluid';
    if (confirm(`Are you sure you want to remove this ${itemType}?`)) {
        let storedList = isDrug 
            ? JSON.parse(localStorage.getItem("drugsList")) || [] 
            : JSON.parse(localStorage.getItem("ivFluidsList")) || [];

        storedList = storedList.filter(item => item.name !== itemName);
        localStorage.setItem(isDrug ? "drugsList" : "ivFluidsList", JSON.stringify(storedList));

        itemElement.remove();
    }
}
