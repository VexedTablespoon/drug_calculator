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

    console.log("Adding drug:", drugName, drugDuration, drugDurationUnit, drugRemovalDate);
}

function addIvFluid() {
    const ivFluidName = document.getElementById("ivFluidName").value;
    const ivFluidDuration = parseInt(document.getElementById("ivFluidDuration").value);
    the ivFluidDurationUnit = document.getElementById("ivFluidDurationUnit").value;
    const ivFluidWarmDate = document.getElementById("ivFluidWarmDate").value;

    console.log("Adding IV fluid:", ivFluidName, ivFluidDuration, ivFluidDurationUnit, ivFluidWarmDate);
}
