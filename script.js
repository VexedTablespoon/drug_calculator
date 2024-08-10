document.addEventListener("DOMContentLoaded", function() {
    function updateCurrentDateTime() {
        const now = new Date();
        const currentDateTimeElement = document.getElementById("currentDateTime");
        currentDateTimeElement.textContent = now.toLocaleDateString('en-GB').replace(/\//g, '-') + ' ' + now.toLocaleTimeString('en-GB', { hour12: false });
    }

    updateCurrentDateTime();
    setInterval(updateCurrentDateTime, 1000);

    document.getElementById("drugRemovalDate").valueAsDate = new Date();
    document.getElementById("ivFluidWarmDate").valueAsDate = new Date();

    function addDrug() {
        const drugName = document.getElementById("drugName").value;
        const drugDuration = parseInt(document.getElementById("drugDuration").value);
        const drugDurationUnit = document.getElementById("drugDurationUnit").value;
        const drugRemovalDate = document.getElementById("drugRemovalDate").value || new Date().toISOString().split('T')[0];

        let expiryDate = calculateExpiryDate(drugRemovalDate, drugDuration, drugDurationUnit);
        const expiryDateString = formatDate(expiryDate);

        const drugItem = document.createElement("div");
        drugItem.className = "item";
        drugItem.innerHTML = `
            <strong>${drugName}</strong>
            <div>Expiry Date: <span class="expiry">${expiryDateString}</span></div>
            <button onclick="removeItem(this)">Remove</button>
        `;
        document.getElementById("drugsList").appendChild(drugItem);
        sortItems(document.getElementById("drugsList"));
    }

    function addIvFluid() {
        const ivFluidName = document.getElementById("ivFluidName").value;
        const ivFluidDuration = parseInt(document.getElementById("ivFluidDuration").value);
        const ivFluidDurationUnit = document.getElementById("ivFluidDurationUnit").value;
        const ivFluidWarmDate = document.getElementById("ivFluidWarmDate").value || new Date().toISOString().split('T')[0];

        let expiryDate = calculateExpiryDate(ivFluidWarmDate, ivFluidDuration, ivFluidDurationUnit);
        const expiryDateString = formatDate(expiryDate);

        const ivFluidItem = document.createElement("div");
        ivFluidItem.className = "item";
        ivFluidItem.innerHTML = `
            <strong>${ivFluidName}</strong>
            <div>Expiry Date: <span class="expiry">${expiryDateString}</span></div>
            <button onclick="removeItem(this)">Remove</button>
        `;
        document.getElementById("ivFluidsList").appendChild(ivFluidItem);
        sortItems(document.getElementById("ivFluidsList"));
    }

    function calculateExpiryDate(startDate, duration, unit) {
        const date = new Date(startDate);
        if (unit === 'days') {
            date.setDate(date.getDate() + duration);
        } else if (unit === 'weeks') {
            date.setDate(date.getDate() + 7 * duration);
        } else if (unit === 'months') {
            date.setMonth(date.getMonth() + duration);
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
        const item = button.parentElement;
        item.parentNode.removeChild(item);
    }

    function sortItems(list) {
        let items = Array.from(list.children);
        items.sort((a, b) => a.querySelector("strong").textContent.localeCompare(b.querySelector("strong").textContent));
        items.forEach(item => list.appendChild(item));
    }

    document.getElementById("drugForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addDrug();
    });

    document.getElementById("ivFluidForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addIvFluid();
    });
});
