let mFilter = false;
let teamFilter = false;
let defaultFilter = false;
let reverseMode = false;

//this is the default function game and settings
function defaultGame() {
    defaultFilter = true;
    begin();
}

//call when we want M's settings
function mGame() {
    mFilter = true;
    begin();
}

// call for Team settings
function teamGame() {
    teamFilter = true;
    begin();

}

// call to play in reverse
function reverseGame() {
    reverseMode = true;
    defaultFilter = true;
    begin();
}

// Generate a number that is between 0 and the length of the JSON object 
function getEmployee(x) {
    return Math.floor(Math.random() * x.length - 1);
}

// Generate a random number to select an unpredictable employee to be the correct answer
function getCorrectPosition() {
    return Math.floor(Math.random() * (4 - 0 + 1)) + 0;

}

//Use an ajax call to get the profiles of the employess
function getData() {
    return $.ajax({
        url: "https://willowtreeapps.com/api/v1.0/profiles",
        method: "GET",
        dataType: "json"
    });
}

//filter those with headshots
function filterHeadshot(key) {
    if (key.headshot.url) {
        return key.headshot.url;
    }
}

//filter all with the first name starting with 'M/m'
function filterMs(key) {
    if (/^m/gi.test(key.firstName)) {
        return key.firstName;
    }
}

//filter all with that currently work at wat
function filterTeam(key) {
    if (key.jobTitle) {
        return key.jobTitle;
    }
}

//function to reload page
function reloadPage() {
    return setTimeout(location.reload(), 3000);
}

//appends employee
function appendEmployee(data, idx, x, y) {
    $(".game")
        .fadeIn("slow")
        .append(
            '<div class="media col">' +
            '<img  src="' +
            "https:" +
            data[idx].headshot.url +
            '" height="' +
            data[idx].headshot.height +
            '" >' +
            '<div class="row">' +
            '<span class="full-name hide-text">' +
            data[idx].firstName +
            " " +
            data[idx].lastName +
            "</span>" +
            "</div>" +
            "</div>"
        );
    //only append the name of the correct employee
    if (x === y) {
        //add extra span element for question mark because match will include whatever is in the class
        $(".h2").append(
            '<span class="correct-name">' +
            data[idx].firstName +
            " " +
            data[idx].lastName +
            "</span>" +
            "<span>?</span>"
        );
    }
}

//append reversed correct employee
function appendReversedEmployee(data, idx, x, y) {
    $(".game").append(
        '<div class=" media col">' +
        '<span class="full-name">' +
        data[idx].firstName +
        " " +
        data[idx].lastName +
        "</span>" +
        "</div>"
    );
    //append photo of correct employee in header
    if (x === y) {
        //add extra span element for question mark because match will include whatever is in the class
        $(".h2").append(
            "<span>" +
            '<img  src="' +
            "https:" +
            data[idx].headshot.url +
            '" height="' +
            data[idx].headshot.height +
            '" >' +
            "</span>" +
            '<span>' +
            '<span class="correct-name hide-text">' +
            data[idx].firstName +
            " " +
            data[idx].lastName +
            "</span>" + "<span>?</span>"
        );
    }
}

//starts game
function begin() {

    //handle the error when the api call doesn't get a response
    getData().error(function () {
        alert("Error! Click 'Ok' and we'll refresh the page for you.");
        reloadPage();
    });

    let filteredJson;
    //Filter by game mode
    //don't run until the data is secured
    getData().done(function (data) {
        if (defaultFilter === true) {
            filteredJson = data.filter(filterHeadshot);
        } else if (mFilter === true) {
            filteredJson = data.filter(filterMs);
        } else if (teamFilter === true) {
            filteredJson = data.filter(filterTeam);
        }

        //store correctPosition outside of loop for comparison we only want to call it once
        const correctPosition = getCorrectPosition();
        //iterate 5 times to append five photos and names
        for (let x = $(".media").length; x <= 4; x++) {
            //Save a new employee to render
            const employee = getEmployee(filteredJson);
            //append name in header and photos below that
            if (!reverseMode) {
                appendEmployee(filteredJson, employee, x, correctPosition);
                //for reverse mode -append names in the game section and photo in the header
            } else {
                appendReversedEmployee(filteredJson, employee, x, correctPosition);
            }

        }
    });
    //Once all are appended I need to be able to match the data based on a click
    //If employee clicked tell them they are correct
    $(".game").on("click", ".media", function () {
        //match full name with the header 
        if ($(this).find(".full-name").text() === $(".correct-name").text()) {
            alert("Congratulations! You are correct!");
            reloadPage();
            //if they're wrong hide the element
        } else {
            $(this).hide();
        }
    });
}