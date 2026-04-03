// register or login function
async function registerFnc({ username, email, password }) {
    // call register endppoint
    try{
        const res = await fetch("http://localhost:6969/api/v1/pptiny/user/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                createdFrom: "cli",
                allowUnlimited: true
            })
        });

        const data = await res.json();
        console.log(data.message);
    }catch(err){
        console.error('Error', err);
    }
}

// login function
async function loginFnc({username, password}){
    try{
        const res = await fetch("http://localhost:6969/api/v1/pptiny/user/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        // get user's hove directory
        const homeDir = os.homedir();

        // build document paths
        const filePath = path.join(homeDir, "Documents", "pptiny.txt");

        const data = await res.json();
                
        // save the token and user id in a file inside my documents folder
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    }catch(err){
        console.error("Error", err);
    }
}

// shorten url function
async function shortenUrlFnc({ url }){
    console.log(url);

    try{
        const res = await fetch("http://localhost:6969/pptiny/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ originalUrl: url, createdBy: 1 })
        });

        const data = await res.json();
        console.log(`Shortened URL: ${data.message}`);
    }catch(err){
        console.log("Error", err);
    }
};