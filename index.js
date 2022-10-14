
const inputEl = document.getElementById("input-el")
const addBtn = document.getElementById("add-btn")
const manualBtn = document.getElementById("manual-btn")
const removeBtn = document.getElementById("remove-btn")
const exportBtn = document.getElementById("export-btn")
const linkList = document.getElementById("link-list")
const locallyStoredList = JSON.parse(localStorage.getItem("myList"))
let myList= []
if (locallyStoredList) {
    myList=locallyStoredList
    displayAsList(myList)
}

function displayAsList(parList){
    let listItems=""
    for (let i=0;i<parList.length;i++) {
        listItems+=`
        <li>
            <a target='_blank' href=${parList[i]}>${parList[i]}</a>
        </li>`
    }
    linkList.innerHTML=listItems
}

addBtn.addEventListener("click",function(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        myList.push(tabs[0].url);
        localStorage.setItem("myList", JSON.stringify(myList))
        displayAsList(myList)
    });
})

manualBtn.addEventListener("click", function(){
    myList.push(inputEl.value)
    localStorage.setItem("myList", JSON.stringify(myList))
    inputEl.value=""
    displayAsList(myList)
})

removeBtn.addEventListener("click",function(){
    myList.pop()
    displayAsList(myList)
    localStorage.clear()
    localStorage.setItem("myList", JSON.stringify(myList))
})

exportBtn.addEventListener("click",function(){
    let myString=""
    for(let i=0;i<myList.length;i++){
        myString+=`${myList[i]}\r\n`
    }
    if(myString){
        chrome.downloads.download({
            url: "data:text/plain," + myString,
            filename: "data.txt",
            conflictAction: "uniquify", // or "overwrite" / "prompt"
            saveAs: false, // true gives save-as dialogue
        }, function(downloadId) {
            console.log("Downloaded item with ID", downloadId)
        })
    }
})
