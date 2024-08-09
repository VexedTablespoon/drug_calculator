document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setDefaultDates();
    updateMedicationsList();
    updateIvFluidsList();
    setInterval(updateDateTime, 1000); // Update time every second
});

function updateDateTime() {
    const currentDateTimeElement = document.getElementById('currentDateTime');
    const now = new Date();
    const date = now.toDateString();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    currentDateTimeElement.textContent = `Current Date & Time: ${date} ${time}`;
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('medicationRemovalDate').value = today;
    document.getElementById('ivFluidWarmDate').value = today;
}

function addMedication() {
    const medicationName = document.getElementById('medicationName').value;
    const duration = parseInt(document.getElementById('medicationDuration').value);
    const durationUnit = document.getElementById('medicationDurationUnit').value;
    const removalDate = new Date(document.getElementById('medicationRemovalDate').value);
    
    if (isNaN(duration) || !removalDate) {
        alert('Please fill out all fields correctly.');
        return;
    }

    const medications = getMedications();
    medications.push({
        name: medicationName,
        duration: duration,
        durationUnit: durationUnit,
        removalDate: removalDate.toISOString(),
    });
    // Sort medications alphabetically
    medications.sort((a, b) => a.name.localeCompare(b.name));
    localStorage.setItem('medications', JSON.stringify(medications));

    updateMedicationsList();
    clearMedicationForm();
}

function getMedications() {
    const medications = localStorage.getItem('medications');
    return medications ? JSON.parse(medications) : [];
}

function removeMedication(index) {
    if (confirm('Are you sure you want to remove this medication?')) {
        const medications = getMedications();
        medications.splice(index, 1);
        localStorage.setItem('medications', JSON.stringify(medications));
        updateMedicationsList();
    }
}

function updateMedicationsList() {
    const medications = getMedications();
    const medicationsList = document.getElementById('medicationsList');
    medicationsList.innerHTML = '';

    medications.forEach((medication, index) => {
        const currentDate = new Date();
        let expiryDate = new Date(medication.removalDate);

        if (medication.durationUnit === 'days') {
            expiryDate.setDate(currentDate.getDate() + medication.duration);
        } else if (medication.durationUnit === 'weeks') {
            expiryDate.setDate(currentDate.getDate() + medication.duration * 7);
        } else if (medication.durationUnit === 'months') {
            expiryDate.setMonth(currentDate.getMonth() + medication.duration);
        }

        const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));

        const medicationItem = document.createElement('div');
        medicationItem.className = 'item';
        medicationItem.innerHTML = `
            <p>Medication: <strong>${medication.name}</strong></p>
            <p>Expiry Date: <strong>${expiryDate.toDateString()}</strong> (${daysLeft} days left)</p>
            <button onclick="removeMedication(${index})">Remove</button>
        `;
        medicationsList.appendChild(medicationItem);
    });
}

function clearMedicationForm() {
    document.getElementById('medicationName').value = '';
    document.getElementById('medicationDuration').value = '';
    document.getElementById('medicationDurationUnit').value = 'days';
    document.getElementById('medicationRemovalDate').value = new Date().toISOString().split('T')[0];
}

function addIvFluid() {
    const ivFluidName = document.getElementById('ivFluidName').value;
    const duration = parseInt(document.getElementById('ivFluidDuration').value);
    const durationUnit = document.getElementById('ivFluidDurationUnit').value;
    const warmDate = new Date(document.getElementById('ivFluidWarmDate').value);
    
    if (isNaN(duration) || !warmDate) {
        alert('Please fill out all fields correctly.');
        return;
    }

    const ivFluids = getIvFluids();
    ivFluids.push({
        name: ivFluidName,
        duration: duration,
        durationUnit: durationUnit,
        warmDate: warmDate.toISOString(),
    });
    // Sort IV fluids alphabetically
    ivFluids.sort((a, b) => a.name.localeCompare(b.name));
    localStorage.setItem('ivFluids', JSON.stringify(ivFluids));

    updateIvFluidsList();
    clearIvFluidForm();
}

function getIvFluids() {
    const ivFluids = localStorage.getItem('ivFluids');
    return ivFluids ? JSON.parse(ivFluids) : [];
}

function removeIvFluid(index) {
    if (confirm('Are you sure you want to remove this IV fluid?')) {
        const ivFluids = getIvFluids();
        ivFluids.splice(index, 1);
        localStorage.setItem('ivFluids', JSON.stringify(ivFluids));
        updateIvFluidsList();
    }
}

function updateIvFluidsList() {
    const ivFluids = getIvFluids();
    const ivFluidsList = document.getElementById('ivFluidsList');
    ivFluidsList.innerHTML = '';

    ivFluids.forEach((ivFluid, index) => {
        const currentDate = new Date();
        let expiryDate = new Date(ivFluid.warmDate);

        if (ivFluid.durationUnit === 'days') {
            expiryDate.setDate(currentDate.getDate() + ivFluid.duration);
        } else if (ivFluid.durationUnit === 'weeks') {
            expiryDate.setDate(currentDate.getDate() + ivFluid.duration * 7);
        } else if (ivFluid.durationUnit === 'months') {
            expiryDate.setMonth(currentDate.getMonth() + ivFluid.duration);
        }

        const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));

        const ivFluidItem = document.createElement('div');
        ivFluidItem.className = 'item';
        ivFluidItem.innerHTML = `
            <p>IV Fluid: <strong>${ivFluid.name}</strong></p>
            <p>Expiry Date: <strong>${expiryDate.toDateString()}</strong> (${daysLeft} days left)</p>
            <button onclick="removeIvFluid(${index})">Remove</button>
        `;
        ivFluidsList.appendChild(ivFluidItem);
    });
}

function clearIvFluidForm() {
    document.getElementById('ivFluidName').value = '';
    document.getElementById('ivFluidDuration').value = '';
    document.getElementById('ivFluidDurationUnit').value = 'days';
    document.getElementById('ivFluidWarmDate').value = new Date().toISOString().split('T')[0];
}
