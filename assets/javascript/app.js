// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC7Ou-pxmVa7oKumfddG1PSEJyU4ngTMbU",
    authDomain: "ucsd-demo-5b2da.firebaseapp.com",
    databaseURL: "https://ucsd-demo-5b2da.firebaseio.com",
    projectId: "ucsd-demo-5b2da",
    storageBucket: "ucsd-demo-5b2da.appspot.com",
    messagingSenderId: "994117258235",
    appId: "1:994117258235:web:7c066a0d3507a522"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//declare variable for database
var database = firebase.database();

//create functions for running time calculations


//write block for on click event with submit button
$("#add-train").on("click", function (event) {
    event.preventDefault();
    console.log("i'm a button and I work!")
    //get data from input fields and store in variable
    var trainName = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var departTime = moment($("#start-input").val().trim(), "HH:mm").format("HH:mm");
    var trainRate = $("#rate-input").val().trim();

    var newTrain = {
        name: trainName,
        destination: destination,
        start: departTime,
        rate: trainRate
    };
    //push those variables to firebase
    database.ref().push(newTrain);
    //clear input fields
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
});

//write block for .on(child_added) for firebase
database.ref().on("child_added", function (snap) {
    console.log(typeof snap.val().start);
    //run calculations for dynamic data variables (next arrival and next train eta)
    // var minutesAway = "exampletime";

    //LOL that's a lot of momentJS's :P
    var minutesAway = snap.val().rate - ((moment().diff(moment(moment(snap.val().start, "HH:mm").subtract(1, "years")), "minutes")) % snap.val().rate);
    var nextArrival = moment(moment().add(minutesAway, "minutes")).format("HH:mm");
    // var nextArrival = "exampletime";
    //create table row with jQuery using firebase data 
    var newRow = $("<tr>").append(
        //append table data pieces to table row with jQuery
        $("<td>").text(snap.val().name),
        $("<td>").text(snap.val().destination),
        $("<td>").text(snap.val().rate),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway),
    );
    //append table row to table body in html using jQuery
    $("tbody").append(newRow);
});