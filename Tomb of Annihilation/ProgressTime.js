// Uses SimpleCalendar's api to progress time forward by 4 hours
// and rolls on a random encounter table based on location according to Tomb of Annihilation's rules
// and finally writes to chat the rough time.

// This is so only the GM can see the results of the random encounter. 
// This will still tip off even remotely observant players that a random encounter has occured as they can see something is hidden from them.
function privateGMMessage(message) 
{
    let chatData = 
    {
        user: game.user.id,
        content: message,
        whisper: game.users.contents.filter(u => u.isGM).map(u => u.id)
    }
    ChatMessage.create(chatData);
}

// Convenient way to populate the buttons to select the location and the corrosponding roll table.
// Key is display name, value is roll table name.
// E.G DisplayName: RollTableName
let locations =
{
    "Beach": "Beach Encounters",
    "Jungle: No Undead": "No Undead Encounters",
    "Jungle: Lesser Undead": "Lesser Undead Encounters",
    "Jungle: Greater Undead": "Greater Undead Encounters",
    "Mountains": "Mountain Encounters",
    "Rivers": "River Encounters",
    "Swamp": "Swamp Encounters",
    "Wasteland": "Wasteland Encounters"
};

let buttons = {};
for (let location in locations) 
{
    buttons[location] = {
        label: location,
        callback: () => {
            game.tables.contents.find(t => t.name === locations[location]).draw({rollMode: "gmroll"});
        }
    }
}

let locationDialogue = new Dialog({
    title: "Random Encounters",
    content: "Where to check for random encounter?",
    buttons: buttons
});

let randomEncounterRoll = (await new Roll("1d20").roll({async: true})).total;
console.log(randomEncounterRoll);

if(randomEncounterRoll >= 16)
{
    // Random Encounter
    locationDialogue.render(true);
}
else
{
    // No Random Encounter
    privateGMMessage("No Random Encounter");
}

// Setting DateTime and writing message to chat.
// Encounters occur each morning, afternoon, and evening or night. I will just go with afternoon, evening, and night so adding time is easier.
// In 5e you spend 8 hours travelling, 8 hours resting. So if the party set off in the morning at 8AM, have an encounter at 12PM, and an encounter at 4PM, and a final encounter at 8PM. 
// So encounters when they're travelling, ending travel, and halfway through long rest.
SimpleCalendar.api.changeDate({hour: +4});

let currentTimestamp = SimpleCalendar.api.timestamp();
let currentHour = SimpleCalendar.api.timestampToDate(currentTimestamp).hour
let currentHourDescription = " The time is... ";
if(currentHour >= 20)
{
    currentHourDescription = "night"
}
else if(currentHour >= 16)
{
    currentHourDescription = "the evening"
}
else if(currentHour >= 12)
{
    currentHourDescription = "the afternoon"
}
else
{
    currentHourDescription = "very late."
}

ChatMessage.create(
        {        
            user: game.user.id,
            content: currentHourDescription
        }
    );
