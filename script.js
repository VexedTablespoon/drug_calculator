document.addEventListener("DOMContentLoaded", () => {
    updateCurrentDateTime();
    setDefaultDateValues();
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
        const expiryDate = calculateExpiryDate(drugRemovalDate, drugDuration, drugDurationUnit);
        const formattedExpiryDate = formatDate(expiryDate);
        const drugItem = {
            name: drugName,
            expiryDate: formattedExpiryDate
        };
        addDrugToList(drugItem);
        document.getElementById("drugName").value = '';
        document.getElementById("drugDuration").value = '';
        document.getElementById("drugRemovalDate").value = new Date().toISOString().split('T')[0];
    }
}

function addDrugToList(drugItem) {
    const drugsList = document.getElementById("drugsList");
    const drugItems = Array.from(drugsList.children).map(item => ({
        name: item.querySelector("strong").innerText,
        expiryDate: item.querySelector(".expiry").innerText
    }));
    drugItems.push(drugItem);
    drugItems.sort((a, b) => a.name.localeCompare(b.name));

    drugsList.innerHTML = '';
    drugItems.forEach(item => {
        const drugElement = document.createElement('div');
        drugElement.classList.add('item');
        drugElement.innerHTML = `
            <strong>${item.name}</strong><br>
            Expiry Date: <span class="expiry">${item.expiryDate}</span><br>
            <button onclick="removeItem(this)">Remove</button>
        `;
        drugsList.appendChild(drugElement);
    });
}

function addIvFluid() {
    const ivFluidName = document.getElementById("ivFluidName").value.trim();
    const ivFluidDuration = document.getElementById("ivFluidDuration").value;
    const ivFluidDurationUnit = document.getElementById("ivFluidDurationUnit").value;
    const ivFluidWarmDate = document.getElementById("ivFluidWarmDate").value || new Date().toISOString().split('T')[0];

    if (ivFluidName && ivFluidDuration) {
        const expiryDate = calculateExpiryDate(ivFluidWarmDate, ivFluidDuration, ivFluidDurationUnit);
        const formattedExpiryDate = formatDate(expiryDate);
        const ivFluidItem = {
            name: ivFluidName,
            expiryDate: formattedExpiryDate
        };
        addIvFluidToList(ivFluidItem);
        document.getElementById("ivFluidName").value = '';
        document.getElementById("ivFluidDuration").value = '';
        document.getElementById("ivFluidWarmDate").value = new Date().toISOString().split('T')[0];
    }
}

function addIvFluidToList(ivFluidItem) {
    const ivFluidsList = document.getElementById("ivFluidsList");
    const ivFluidItems = Array.from(ivFluidsList.children).map(item => ({
        name: item.querySelector("strong").innerText,
        expiryDate: item.querySelector(".expiry").innerText
    }));
    ivFluidItems.push(ivFluidItem);
    ivFluidItems.sort((a, b) => a.name.localeCompare(b.name));

    ivFluidsList.innerHTML = '';
    ivFluidItems.forEach(item => {
        const ivFluidElement = document.createElement('div');
        ivFluidElement.classList.add('item');
        ivFluidElement.innerHTML = `
            <strong>${item.name}</strong><br>
            Expiry Date: <span class="expiry">${item.expiryDate}</span><br>
            <button onclick="removeItem(this)">Remove</button>
        `;
        ivFluidsList.appendChild(ivFluidElement);
    });
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

function removeItem(button) {
    if (confirm('Are you sure you want to remove this item?')) {
        button.parentElement.remove();
    }
}
