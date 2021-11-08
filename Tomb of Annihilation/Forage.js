// A player macro that will roll a survival check to determine if food/water is found
// it will check the roll against a DC determined by resource availability. 
// Forage rules located in Chapter 5 of the Dungeon Master's Guide.

// TODO: Remind the player that they must do this while travel and it means when marching they will be unavaliable for other tasks. Put the possible actions in Foundry and visible to players.

// Actor will work with selected token, character is for players but actor is easier to test and might work better for multiple controlled actors.
if(actor !== undefined)
{
    var currentCharacter = actor; // And this works, because JavaScript.
}
else if(character !== undefined)
{
    currentCharacter = character;
}
else if(character === undefined)
{
    console.log("No selected token/owned character.");
    return;
}

// Homebrew DCs for Tomb of Annihilation: DC 10 if by river, DC 15 if in jungle, DC 20 elsewhere
var difficultyCheck = 0;
let locationDialogue = new Dialog(
{
    title: "Forage Check",
    content: "What is the avaliability of resources like?",
    buttons: 
    {
        one: 
        {
            label: "Abundant (River)",
            callback: () => { difficultyCheck = 10; checkSuccess();}
        },
        two: 
        {
            label: "Limited (Jungle)",
            callback: () => { difficultyCheck = 15; checkSuccess();}
        },
        three: 
        {
            label: "Very Little (Elsewhere)",
            callback: () => { difficultyCheck = 20; checkSuccess(); }
        }
    }
});
locationDialogue.render(true);

async function checkSuccess()
{
    roll = (await currentCharacter.rollSkill("sur"))._total; // Need to await on the object, not the total otherwise it will not wait.

    var food = 0;
    var water = 0;

    if (roll >= difficultyCheck)
    {
        food = (await new Roll("1d6").roll({async: true})).total + currentCharacter.data.data.abilities.wis.mod;
        console.log("", food);
        water = (await new Roll("1d6").roll({async: true})).total + currentCharacter.data.data.abilities.wis.mod;
    }

    ChatMessage.create(
        {
            user: game.user.id,
            content: `Found ${food}lbs of food and ${water} gallons of water.`,
        });
}