// Uses SimpleCalendar's API to progress the time to 8AM the following day
// and writes a reminder in the chat to rest, using homebrew long/short rest rules,
// as well as to eat or drink.

// TODO: Weather
// TODO: Forage macro, exhaustion check.

var daysBetweenJungleRest = 7;
var secondsInDay = (60*60*24);
var secondsInAdventuringDay = daysBetweenJungleRest * secondsInDay;

let getJournal = game.journal.getName("LongRestDate"); // Otherwise it seems to re-update with old values.

function americanDateToProperDate(dateObject) { return `${dateObject.day} ${dateObject.monthName}, ${dateObject.year}` } // Bloody Americans.


async function restInJungle()
{
    SimpleCalendar.api.changeDate({day: 1});
    SimpleCalendar.api.setDate({hour: 8, minute: 0, second: 0});

    var lastLongRestTimestamp = getJournal.data.content;
    var currentTimestamp = SimpleCalendar.api.timestamp();
    var timestampDifference = currentTimestamp - lastLongRestTimestamp; 

    var currentDate = americanDateToProperDate(SimpleCalendar.api.timestampToDate(currentTimestamp).display);
    var message = `<h2 style="font-size:1.25em"> ${currentDate} </h2> <p>8 hours have passed. Do a `;
    if (timestampDifference < secondsInAdventuringDay) // Short rest
    {
        message += "short";
    }
    else // Long rest
    {
        await getJournal.update({_id: getJournal.data._id, "content" : currentTimestamp}); // Update last long rest timestamp in journal.
        message += "long";
    }

    // Need to create nextLongRestTimestamp after "if/else" as the recorded timestamp will change after the "else".
    var nextLongRestTimestamp = parseInt(getJournal.data.content) + secondsInAdventuringDay; // This is why I hate dynamically typed langauges.
    var nextLongRestDate = await americanDateToProperDate(SimpleCalendar.api.timestampToDate(nextLongRestTimestamp).display);
    message += ` rest, and eat or drink. <br>The next long rest is on the ${nextLongRestDate}.</p>`;

    ChatMessage.create(
        {
            user: game.user.id,
            content: message,
        }
    );
}

async function restOutOfJungle()
{
    SimpleCalendar.api.changeDate({hour: 8});
    await getJournal.update({_id: getJournal.data._id, "content" : 0});
    ChatMessage.create(
        {
            user: game.user.id,
            content: "8 hours have passed. Do a long rest.",
        }
    );
}

let locationDialogue = new Dialog({
    title: "Resting Location",
    content: "Where are the players resting?",
    buttons: {
        one: {
         label: "Rest in Jungle",
         callback: restInJungle
        },
        two: {
         label: "Rest out of Jungle",
         callback: restOutOfJungle
        }
       }
});
locationDialogue.render(true);