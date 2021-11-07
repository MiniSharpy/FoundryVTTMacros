async function getSex()
{
    let sex = "invalidSex"
    let roll = (await new Roll("1d2").roll({async: true})).total;
    console.log("", roll);

    if(roll == 1)
    {
        sex = "Male";
    }
    else
    {
        sex = "Female";
    }
    return sex;

}

async function getFirstName(sex)
{
    let firstName = "noName";
    if(sex == "Male")
    {
        firstName = (await game.tables.contents.find(t => t.name === "Chultan Male Names").roll()).results[0].data.text;
    }
    else if(sex == "Female")
    {
        firstName = (await game.tables.contents.find(t => t.name === "Chultan Female Names").roll()).results[0].data.text;
    }
    return firstName;
}

async function getChultan() 
{

    let sex = await getSex();
    let firstName = await getFirstName(sex);
    let lastName = (await game.tables.contents.find(t => t.name === "Chultan Dynastic Names").roll()).results[0].data.text;
    let age = (await new Roll("1d30+15").roll({async: true})).total + " years."

    return "<p><b>" + firstName + " " + lastName + "</b></p><p>" + sex + " | " + age + "</p>";
}

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

privateGMMessage(await getChultan());