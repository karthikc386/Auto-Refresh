chrome.runtime.onInstalled.addListener(function() {
    console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveData") {
        const data = request.data;
        chrome.storage.local.set(data, () => {
            console.log('Data saved successfully!'+ JSON.stringify(data));
            sendResponse({ message: "Data saved successfully!" });
        });
    } else if (request.action === "getData") {
        chrome.storage.local.get(null, (result) => {            
            console.log('Get Data!'+ JSON.stringify(result));
            sendResponse(result);
        });
        return true;
    }
});
  