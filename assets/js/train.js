//test script load is successful

//alert("scripts loaded successfully!")

// Initialize Firebase
var config = {
    apiKey: "AIzaSyB5KZZNy1EwicfLk4tob0a_QCeFnLnUxn4",
    authDomain: "trainschedule-5c808.firebaseapp.com",
    databaseURL: "https://trainschedule-5c808.firebaseio.com",
    projectId: "trainschedule-5c808",
    storageBucket: "",
    messagingSenderId: "463526946189"
};

firebase.initializeApp(config);
// sound FX
var audio = new Audio("assets/sound/spaceport.mp3")

function bgMusicPlay() {
    audio.play();
    audio.loop = true;
};

bgMusicPlay();


$("#sound-off").click(function () {

    audio.pause();

});

$("#sound-on").click(function () {

    bgMusicPlay();

});



//site clock

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById("time").innerHTML = "Human Readable Time " +
        h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    };
    return i;
}

startTime();

// admin panel animation
$("#adminArea").hide(100);
$("#toggleForm").click(function () {

    $("#adminArea").toggle(2500);
});
// database setup and time format
var myData = firebase.database();
var timeNow = moment().format("X")
$("#current-time").html("<h4>Unix Time: " + timeNow + "</h4>");

// set up event listener
$("#submit-schedule").on("click", function (event) {
    
   // $("#schedule" ).empty();

    //event.preventDefault();

    $("#current-time").html("<h4>Unix Time: " + timeNow + "</h4>");

    var trainName = $("#train-name").val().trim();
    var trainDest = $("#train-destination").val().trim();
    var trainTime = $("#train-firstTime").val().trim();
    var trainFreq = $("#train-frequency").val().trim();
    $("#form").trigger("reset");
    //alert(trainName);

    //**********************************************************************

    var timeDifference = moment().diff(moment(trainTime, "hh:mm A"), 'm');
    var timeRemaining = timeDifference % trainFreq;
    var timeMinsAway = trainFreq - timeRemaining;
    var timeNext = moment().add(timeMinsAway, 'm');
    var next = moment(timeNext).format("hh:mm A");
    var away = timeMinsAway;

    //**********************************************************************

    myData.ref("/Schedule/").push({
        Name: trainName,
        Dest: trainDest,
        Time: trainTime,
        Freq: trainFreq,
        nextTrain: next,
        timeAway: away


    });
    
    

    });

myData.ref("/Schedule").on("child_added", function (snap) {

        
        var record = snap.val();
        var currentTime = parseInt(moment().format("HH:mm"));

        // push updates back to client page
        $("#schedule").append("<tr><td>" + record.Name + "</td><td>" + record.Dest + "</td><td>" + record.Freq + "</td><td>" + record.nextTrain + "</td><td>" + record.timeAway + "</td></tr>)");
});
