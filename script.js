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
        if (clearCache) {
            clearCacheCheckbox.checked = clearCache === "true";
        }
    });
    
    getDataFromStorage("loopRefresh", (loopRefresh) => {
        if (loopRefresh) {
            loopRefreshCheckbox.checked = loopRefresh === "true";
        }
    });

    getDataFromStorage("autoRefreshStatus", (autoRefreshStatus) => {
        if (autoRefreshStatus !== null) {
            if (autoRefreshStatus === "ON" && loopRefreshCheckbox.checked) {
                toggle.checked =  "true";;
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
            chrome.storage.local.clear();
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
        
        const refreshInterval = parseInt(document.getElementById('refreshInterval').value, 10) * 1000; 

        setDataInStorage("refreshInterval", refreshIntervalInput.value);
        setDataInStorage("clearCache", clearCacheCheckbox.checked);
        setDataInStorage("loopRefresh", loopRefreshCheckbox.checked);
        
        if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
        }

        refreshIntervalId = setInterval(refreshPage, refreshInterval);
        
        updateLastRefreshed();
        updateNextRefresh(refreshInterval);
        updateSecondsLeft(refreshInterval);
    }

    function refreshPage() {
        updateLastRefreshed();
        if(clearCacheCheckbox.checked)
            location.reload(true);
        else
            //location.reload();
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.reload(tabs[0].id);
              });
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
        secondsLeftElement.textContent = (interval / 1000);
        
        if (intervalId) {
            clearInterval(intervalId);
        }

        intervalId = setInterval(function() {
            interval -= 1000;
            secondsLeftElement.textContent = (interval / 1000);
        }, 1000);
    }
});