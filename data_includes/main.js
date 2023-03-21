PennController.ResetPrefix(null) // Shorten command names (keep this line here))

// Start with welcome screen, then present test trials in a random order,
// and show the final screen after sending the results
Sequence( "setup", "instructions" , "practice" , randomize("experiment") , "send" , "final" )

//Header( /* void */ )
    // This .log command will apply to all trials
//    .log( "ID" , GetURLParameter("id") ) // Append the "ID" URL parameter to each result line

// Welcome screen and logging user's ID
newTrial("setup",
     // Automatically print all Text elements, centered
    defaultText.left().print()
    ,
    newText("Hi!")
    ,
    newText("To get started, we'll collect some basic information so that we can assign you credit and compare results across English language background groups.")
    ,
    newText("Enter your uniqname (without the @umich.edu):")
    ,
    // ID input
    newTextInput("inputID", "")
  //     .center()
     //   .css("margin","1em")    // Add a 1em margin around this element
        .print()
    ,
    newText("Was English a primary or dominant language of your environment for most of your first ten years?")
    ,
    // English input
    newDropDown("inputEnglish" , "")
    .add( "yes" , "no" )
    .print()
    ,
    newButton("Start")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    newVar("partID")
        .global()
        .set(getTextInput("inputID") )
    ,
    newVar("English")
        .global()
        .set(getDropDown("inputEnglish") )
)
//.log("partID", getVar("partID"))
.log("English", getVar("English"))

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("partID").global()    
)
.log( "partid" , getVar("partID") ) // Add the ID to all trials' results lines



// instructions
newTrial( "instructions" ,
    // We will print all Text elements, horizontally centered
    defaultText.center().print()
    ,
    newText("Welcome!")
    ,
    newText("In this experiment you are asked to decide whether the letter strings (appearing at the center of the screen) form real English words.")
    ,
    newText("To do this, press F if what you see is a word, or J if it is not a word.")
    ,
    newText("You should do this as quickly and accurately as possible.")
    ,
    newText("When you are ready, press SPACE to do a practice run.")
    ,
    newKey(" ").wait()  // Finish trial upon press on spacebar
)

newTrial("practice" ,
    // Text element at the top of the page to signal this is a practice trial
    newText("practice").color("blue").print("center at 50vw","top at 1em")
    ,
    // Display all future Text elements centered on the page, and log their display time code
    defaultText.center().print("center at 50vw","middle at 50vh")
    ,
    // Automatically start and wait for Timer elements when created
    defaultTimer.start().wait()
    ,
    // Mask, shown on screen for 500ms
    newText("mask","######"),
    newTimer("maskTimer", 500),                       
    getText("mask").remove()
    ,
    // Prime, shown on screen for 72ms
    newText("prime","flower"),
    newTimer("primeTimer", 72),
    getText("prime").remove()
    ,
    // Target, shown on screen until F or J is pressed
    newText("target","FLOWER")
    ,
    // Use a tooltip to give instructions
    newTooltip("guide", "Now press F if this is an English word, J otherwise")
        .position("bottom center")  // Display it below the element it attaches to
        .key("", "no click")        // Prevent from closing the tooltip (no key, no click)
        .print(getText("target"))   // Attach to the "target" Text element
    ,
    newKey("answerTarget", "FJ")
        .wait()                 // Only proceed after a keypress on F or J
        .test.pressed("F")      // Set the "guide" Tooltip element's feedback text accordingly
        .success( getTooltip("guide").text("<p>Yes, FLOWER <em>is</em> an English word</p>") )
        .failure( getTooltip("guide").text("<p>You should press F: FLOWER <em>is</em> an English word</p>") )
    ,
    getTooltip("guide")
        .label("Press SPACE to start")  // Add a label to the bottom-right corner
        .key(" ")                       // Pressing Space will close the tooltip
        .wait()                         // Proceed only when the tooltip is closed
    ,
    getText("target").remove()          // End of trial, remove "target"
)

// Executing experiment from list.csv table, where participants are divided into two groups (A vs B)
Template( "rastle_stimuli.csv" , 
    row => newTrial( "experiment" ,   
        // Display all Text elements centered on the page, and log their display time code
        defaultText.center().print("center at 50vw","middle at 50vh").log()
        ,
        // Automatically start and wait for Timer elements when created, and log those events
        defaultTimer.log().start().wait()
        ,
        // Mask, shown on screen for 500ms
        newText("mask","######"),
        newTimer("maskTimer", 500),                       
        getText("mask").remove()
        ,
        // Prime, shown on screen for 42ms
        newText("prime",row.prime),
        newTimer("primeTimer", 42),
        getText("prime").remove()
        ,
        // capture time for when target is displayed
        newVar("RT").global().set(()=>Date.now())
        ,
        // Target, shown on screen until F or J is pressed
        newText("target",row.target)
        ,
        newKey("answerTarget", "FJ").log().wait()   // Proceed upon press on F or J (log it)
        ,
        getText("target").remove()
        // End of trial, move to next one
        ,
        // get difference between presentation and key press
        getVar("RT").set(v=>Date.now()-v)
    )
    .log( "Group"     , row.group)      // Append group (A vs B) to each result line
    .log( "Expected"  , row.expected )  // Append expectped (f vs j) to each result line
    .log( "PrimeType", row.primetype ) // Append prime type (rel. vs unr.) to each result line
    .log( "ExpType", row.type ) // Append condition type (experimental vs control vs filler) to each result line
    .log( "RT", getVar("RT"))
)

// Send the results
SendResults("send")

// A simple final screen
newTrial ( "final" ,
    newText("The experiment is over. Thank you for participating!")
        .print()
    ,
    newText("You can now close this page.")
        .print()
    ,
    // Stay on this page forever
    newButton().wait()
)