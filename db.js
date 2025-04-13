import mysql from "mysql";

export const db = mysql.createConnection({
  host: "bnzvj8lugdkgwzkhrymq-mysql.services.clever-cloud.com",
  user: "uavsc8p6rdomt0rc",
  password: "aV474g09vIY6dCWLCT26",
  database: "bnzvj8lugdkgwzkhrymq",
  port: "3306",
});

if(db) console.log("db Connected");
else console.log("Connecting..")
