const refreshIntervalInput = document.getElementById("refreshInterval");
const clearCacheCheckbox = document.getElementById("clearCache");
const loopRefreshCheckbox = document.getElementById("loopRefresh");
const lastRefreshedElement = document.getElementById('lastRefreshed');
const nextRefreshElement = document.getElementById('nextRefresh');
const secondsLeftElement = document.getElementById('secondsLeft');
const toggle = document.getElementById('toggle');
const status = document.getElementById('status');

let refreshIntervalId;  
let intervalId; 

document.addEventListener("DOMContentLoaded", function() {
    
    function getDataFromStorage(key, callback) {
        chrome.storage.local.get(key, (result) => {
            callback(result[key]);
        });
    }

    function setDataInStorage(key, value) {
        chrome.storage.local.set({ [key]: value });
    }

    getDataFromStorage("refreshInterval", (refreshInterval) => {
        if (refreshInterval) {
            refreshIntervalInput.value = refreshInterval;
        }
    });
    
    getDataFromStorage("clearCache", (clearCache) => {
        clearCacheCheckbox.checked = clearCache === "true";
    });
    
    getDataFromStorage("loopRefresh", (loopRefresh) => {
        loopRefreshCheckbox.checked = loopRefresh === "true";
    });

    getDataFromStorage("autoRefreshStatus", (autoRefreshStatus) => {
        if (autoRefreshStatus !== null) {
            if (autoRefreshStatus === "ON") {
                toggle.checked =  true;
                status.textContent = "ON";
                setRefreshInterval();
            }
        }
    });

    toggle.addEventListener('change', function() {
        if (this.checked) {
            status.textContent = 'ON';
            setRefreshInterval();
            setDataInStorage("autoRefreshStatus", "ON");
        } else {
            status.textContent = 'OFF';
            lastRefreshedElement.textContent = "";
            nextRefreshElement.textContent = "";
            secondsLeftElement.textContent = "-";
            clearInterval(refreshIntervalId);
            clearInterval(intervalId);
            setDataInStorage("autoRefreshStatus", "OFF");
        }
    });

    clearCacheCheckbox.addEventListener('change', function() {
        setDataInStorage("clearCache", this.checked.toString());
    });

    loopRefreshCheckbox.addEventListener('change', function() {
        setDataInStorage("loopRefresh", this.checked.toString());
    });

    const GET_INTERVAL_BUTTON = document.getElementById('setRefreshInterval');
    GET_INTERVAL_BUTTON.addEventListener('click', async () => {
        setRefreshInterval();
    });

    function setRefreshInterval() {       
        const refreshInterval = parseInt(refreshIntervalInput.value, 10) * 1000; 
    
        setDataInStorage("refreshInterval", parseInt(refreshIntervalInput.value, 10));
        setDataInStorage("clearCache", clearCacheCheckbox.checked.toString());
        setDataInStorage("loopRefresh", loopRefreshCheckbox.checked.toString());
    
        if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
        }
    
        refreshIntervalId = setInterval(refreshPage, refreshInterval);
    
        updateLastRefreshed();
        updateNextRefresh(refreshInterval);  // ✅ Ensure this is called!
        updateSecondsLeft(refreshInterval);
    }
    
    
    function refreshPage() {
        updateLastRefreshed();  // Update last refreshed time
    
        const refreshInterval = parseInt(refreshIntervalInput.value, 10) * 1000;
    
        if (clearCacheCheckbox.checked) {
            location.reload();  // No need for argument
        } else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        }
    
        // 🛠️ Fix: Update Next Refresh Time after Refresh
        updateNextRefresh(refreshInterval);
    
        // Restart the countdown timer for next refresh
        updateSecondsLeft(refreshInterval);
    }
    
    

    function updateLastRefreshed() {
        const now = new Date();
        lastRefreshedElement.textContent = now.toLocaleTimeString();
    }

    function updateNextRefresh(interval) {
        const now = new Date();
        const nextRefreshTime = new Date(now.getTime() + interval);
        nextRefreshElement.textContent = nextRefreshTime.toLocaleTimeString();
    }
   

    function updateSecondsLeft(interval) {
        let timeLeft = interval / 1000; // Convert milliseconds to seconds
        secondsLeftElement.textContent = timeLeft;
    
        // Clear any previous countdown interval before starting a new one
        if (intervalId) {
            clearInterval(intervalId);
        }
    
        intervalId = setInterval(function () {
            timeLeft -= 1;
            secondsLeftElement.textContent = timeLeft;
    
            // If countdown reaches 0, stop the countdown
            if (timeLeft <= 0) {
                clearInterval(intervalId);
            }
        }, 1000);
    }
    
});