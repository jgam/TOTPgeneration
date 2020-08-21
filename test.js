const axios = require('axios');
const base64 = require('base-64');
const utf8 = require('utf8');

const { totp } = require('otplib');
const GITHUB_URL = "https://github.com/jgam/tester-prj"
const MY_EMAIL = "jgam@alumni.nd.edu"
const CHALLENGE_URL = "https://api.challenge.hennge.com/challenges/003"

const reqJSON = 
{
    github_url: GITHUB_URL,
    contact_email: MY_EMAIL
}
const stringData = JSON.stringify(reqJSON);

const URL = CHALLENGE_URL;
const sharedSecret = reqJSON.contact_email + "HENNGECHALLENGE003";
console.log(sharedSecret);

totp.options = { digits: 10, algorithm: "sha512", epoch:0, step: 30 }

const myTotp = totp.generate(sharedSecret);
const isValid = totp.check(myTotp, sharedSecret);

console.log("Token Info:", {myTotp, isValid});

const authStringUTF = reqJSON.contact_email + ":" + myTotp;
const bytes = utf8.encode(authStringUTF);
const encoded = base64.encode(bytes);

const createReq = async () =>
{

    try 
    {
        // set the headers
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // "Authorization": {
                //     'Username': 'jgam@alumni.nd.edu',
                //     'Password': myTotp,
                // },
                // "Authorization": 'Basic '+ encoded
            },
            auth: {
                username: 'jgam@alumni.nd.edu',
                password: myTotp,
            }
        };
        console.log("Making req", {URL, reqJSON, config});
        console.log(stringData);
        console.log(URL)

        const res = await axios.post(URL, stringData, config);
        console.log(res.data);
    }
    catch (err)
    {
        console.error(err.response.data);
    }
};

createReq();
