document.addEventListener("DOMContentLoaded", function() {
    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 1000);

    document.getElementById("drugForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addDrug();
    });

    document.getElementById("ivFluidForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addIvFluid();
    });
});

function updateCurrentDateTime() {
    const now = new Date();
    document.getElementById("currentDateTime").textContent = now.toLocaleDateString('en-GB', {hour12: false}) + ' ' + now.toLocaleTimeString('en-GB', {hour12: false});
}

function addDrug() {
    const drugName = document.getElementById("drugName").value;
    const drugDuration = parseInt(document.getElementById("drugDuration").value);
    const drugDurationUnit = document.getElementById("drugDurationUnit").value;
    const drugRemovalDate = document.getElementById("drugRemovalDate").value;

    if (drugName && drugDuration && drugDurationUnit && drugRemovalDate) {
        const expiryDate = calculateExpiryDate(new Date(drugRemovalDate), drugDuration, drugDurationUnit);
        displayItem('drugsList', drugName, expiryDate);
        clearFormInputs('drugName', 'drugDuration');
    }
}

function addIvFluid() {
    const ivFluidName = document.getElementById("ivFluidName").value;
    const ivFluidDuration = parseInt(document.getElementById("ivFluidDuration").value);
    const ivFluidDurationUnit = document.getElementById("ivFluidDurationUnit").value;
    const ivFluidWarmDate = document.getElementById("ivFluidWarmDate").value;

    if (ivFluidName && ivFluidDuration && ivFluidDurationUnit && ivFluidWarmDate) {
        const expiryDate = calculateExpiryDate(new Date(ivFluidWarmDate), ivFluidDuration, ivFluidDurationUnit);
        displayItem('ivFluidsList', ivFluidName, expiryDate);
        clearFormInputs('ivFluidName', 'ivFluidDuration');
    }
}

function calculateExpiryDate(startDate, duration, unit) {
    switch (unit) {
        case 'days':
            startDate.setDate(startDate.getDate() + duration);
            break;
        case 'weeks':
            startDate.setDate(startDate.getDate() + (duration * 7));
            break;
        case 'months':
            startDate.setMonth(startDate.getMonth() + duration);
            break;
    }
    return startDate;
}

function displayItem(listId, name, expiryDate) {
    const list = document.getElementById(listId);
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
        <strong>${name}</strong>
        <div>Expiry Date: ${expiryDate.toLocaleDateString('en-GB')}</div>
        <button onclick="removeItem(this)">Remove</button>
    `;
    list.appendChild(item);
}

function clearFormInputs(...inputIds) {
    inputIds.forEach(id => {
        document.getElementById(id).value = '';
    });
}

function removeItem(button) {
    button.parentElement.remove();
}
