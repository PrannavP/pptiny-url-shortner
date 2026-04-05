#!/usr/bin/env node
require("dotenv").config();

const { Command } = require("commander");
const fs = require('fs');
const path = require("path");
const os = require("os");
const clipboardy = require("clipboardy").default;

// is dev version or prod version
const is_production = process.env.RELEASE_VERSON === "PRODUCTION";

let baseUrl = is_production ? process.env.BACKEND_SERVER_URL_PROD : process.env.BACKEND_SERVER_URL_LOCAL;

const program = new Command();

// cli tool data (--help command)
program.name("PP Tiny URL Shortner").description("PP URL Shortner CLI Tool").version("1.0.0");

const user = program.command("user").description("User operations");
const url = program.command("url").description("Shorten URL");

// register or login function
async function registerFnc({ username, email, password }) {
    // call register endppoint
    try{
        const res = await fetch(`${baseUrl}/api/v1/pptiny/user/register`, {
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
        const res = await fetch(`${baseUrl}/api/v1/pptiny/user/login`, {
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
    try{
        const res = await fetch(`${baseUrl}/pptiny/shorten`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ originalUrl: url, createdBy: 1 })
        });

        const data = await res.json();

        // copy the url in clipboard
        await clipboardy.writeSync(data.message);
        
        console.log(`Shortened URL: ${data.message}`);
    }catch(err){
        console.log("Error", err);
    }
};

// commands
program
    .command("tiny")
    .description("Shorten URL")
    .option("-u, --url <string>")
    .action((options) => {
        callTinyUrlService(options.url)
    });

// register
user
  .command("register")
  .description("Create user account")
  .argument("<username>")
  .argument("<email>")
  .argument("<password>")
  .action((username, email, password) => {
    registerFnc({ username, email, password });
  });

// login
user
  .command("login")
  .description("Login into your account")
  .argument("<username>")
  .argument("<password>")
  .action((username, password) => {
    loginFnc({ username, password });
  }); 

// create short url
url
  .command("short")
  .description("Enter url you want to shorten")
  .argument("<long_url>")
  .action((url) => {
    shortenUrlFnc({ url });
  });

program.parse();

// node main.js url short <url>