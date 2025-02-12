require("dotenv").config();
const http = require("http");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const PORT = 5000;
const usersFile = "users.json";

const setCorsHeaders = (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allowed methods
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allowed headers
};


const server = http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
        setCorsHeaders(res);
        res.writeHead(204);
        return res.end();
    }

    setCorsHeaders(res); 


    if(req.method === "POST" && req.url === "/register"){
        let body ="";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            const { username, password } = JSON.parse(body);

            const hashedPassword = await bcrypt.hash(password, 10);

            const users = JSON.parse(fs.readFileSync(usersFile, "utf-8") || "[]");

            users.push({ username, password: hashedPassword});

            fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
            
            res.writeHead(201, {"Content-Type": "application/json"});
            res.end(JSON.stringify({message : "User registrated successfully! "}));

        });
     } //login logic
     else if(req.method === "POST" && req.url === "/login"){
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", async() =>{
            const { username, password} = JSON.parse(body);

            const users = JSON.parse(fs.readFileSync(usersFile, "utf-8") || "[]");
            const user = users.find(u => u.username === username);

            if(!user){
                res.writeHead(401, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({message: "user not found!"}));
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                res.writeHead(401, {"Content-Type" : "application/json"});
                return res.end(JSON.stringify({message : "Invalid password!"}));
            }

            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({message : "Logged-in successfully!"}));
        });
     }else{
    
    res.writeHead(404, { "Content-Type": "application/json;"});
    res.end(JSON.stringify({message : "Route not found!"}));
  }

});

server.listen(PORT, () => {
    console.log(`Server is sunning on port ${PORT}`);
})