document.addEventListener("DOMContentLoaded", () => {
    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 1000);
});

function updateCurrentDateTime() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB');
    const formattedTime = now.toLocaleTimeString('en-GB', { hour12: false });
    document.getElementById('currentDateTime').innerText = `${formattedDate} ${formattedTime}`;
}

function addDrug() {
    const drugName = document.getElementById("drugName").value.trim();
    const drugDuration = document.getElementById("drugDuration").value;
    const drugDurationUnit = document.getElementById("drugDurationUnit").value;
    const drugRemovalDate = document.getElementById("drugRemovalDate").value || new Date().toISOString().split('T')[0];

    if (drugName && drugDuration) {
        const expiryDate = calculateExpiryDate(drugRemovalDate, drugDuration, drugDurationUnit);
        const drugItem = `
            <div class="item">
                <strong>${drugName}</strong><br>
                Removal Date: ${drugRemovalDate}<br>
                Expiry Date: ${expiryDate}<br>
                <button onclick="removeItem(this)">Remove</button>
            </div>
        `;
        document.getElementById("drugsList").insertAdjacentHTML('beforeend', drugItem);
        document.getElementById("drugName").value = '';
        document.getElementById("drugDuration").value = '';
        document.getElementById("drugRemovalDate").value = '';
    }
}

function addIvFluid() {
    const ivFluidName = document.getElementById("ivFluidName").value.trim();
    const ivFluidDuration = document.getElementById("ivFluidDuration").value;
    const ivFluidDurationUnit = document.getElementById("ivFluidDurationUnit").value;
    const ivFluidWarmDate = document.getElementById("ivFluidWarmDate").value || new Date().toISOString().split('T')[0];

    if (ivFluidName && ivFluidDuration) {
        const expiryDate = calculateExpiryDate(ivFluidWarmDate, ivFluidDuration, ivFluidDurationUnit);
        const ivFluidItem = `
            <div class="item">
                <strong>${ivFluidName}</strong><br>
                Warm Date: ${ivFluidWarmDate}<br>
                Expiry Date: ${expiryDate}<br>
                <button onclick="removeItem(this)">Remove</button>
            </div>
        `;
        document.getElementById("ivFluidsList").insertAdjacentHTML('beforeend', ivFluidItem);
        document.getElementById("ivFluidName").value = '';
        document.getElementById("ivFluidDuration").value = '';
        document.getElementById("ivFluidWarmDate").value = '';
    }
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
    return date.toISOString().split('T')[0];
}

function removeItem(button) {
    if (confirm('Are you sure you want to remove this item?')) {
        button.parentElement.remove();
    }
}
