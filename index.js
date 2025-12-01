const express = require("express");
require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2/promise");
const session = require("express-session");
const bodyparser = require("body-parser");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp_2025_config");
const loginCheck = require("./src/checkLogin");
const textRef = "public/txt/vanasonad.txt";
const pool = require("./src/dbPool");
const kulastajadRef = "public/txt/visitlog.txt"

console.log(process.env.DB_HOST)

/*dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
};*/

//käivitan express.js funktsiooni ja annan nime app
const app = express();
//app.use(session({secret: dbInfo.configData.sessionSecret, saveUninitialized: true, resave: true}));
app.use(session({secret: process.env.SES_SECRET, saveUninitialized: true, resave: true}));
//määran veebilehe renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));
//parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: false}));

app.get("/", async (req, res)=>{
	//let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT file_name, alt_text FROM gallery_photos WHERE id=(SELECT MAX(id) FROM gallery_photos WHERE privacy=? AND deleted IS NULL)";
		const privacy = 3;
		//const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		const [rows, fields] = await pool.execute(sqlReq, [privacy]);
		console.log(rows);
		let imgAlt = "Avalik foto";
		if(rows[0].alt_text != ""){
			imgAlt = rows[0].alt_text;
		}
		res.render("index", {imgFile: "gallery/normal/" + rows[0].file_name, imgAlt: imgAlt});
	}
	catch(err){
		console.log(err);
		//res.render("index");
		res.render("index", {imgFile: "", imgAlt: "Ei leidnud ühtegi avalikku pilti andmebaasist"});
	}
	finally {
		/*if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}*/
	}
});

app.get("/timenow", (req, res)=>{
    const weekDayNow = dateEt.weekDay();
    const dateNow = dateEt.fullDate();
    res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow})
});

app.get("/vanasonad", (req, res)=>{
    let folkWisdom = [];
    fs.readFile(textRef, "utf-8", (err, data) => {
        if(err) {
            //kui tuleb error siis valjastame lehe aga lihtsalt vanasõnu pole
            res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna"]});
        }
        else {
            folkWisdom = data.split(";");
            res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom});
        }
    });
});

//sisseloginud kasutajate osa avaleht
app.get("/home", loginCheck.isLogin, (req,res)=>{
	console.log("Sisse logis kasutaja: " + req.session.userId);
	res.render("home", {user: req.session.firstName + " " + req.session.lastname});
});

//Väljalogimine
app.get("/logout", (req,res)=>{
	//Tühistame sessiooni
	req.session.destroy();
	console.log("VÃ¤lja logitud!");
	res.redirect("/");
});

//Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilm_Routes");
app.use("/Eestifilm", eestifilmRouter);

//Galeriifotode üleslaadimine
const photoupRouter = require("./routes/photoupRoutes");
app.use("/galleryphotupload", photoupRouter);

//Galeriifotode vaatamine
const photogalleryRouter = require("./routes/photogalleryRoutes");
app.use("/photogallery", photogalleryRouter);

//Külalislogide marsruudid
const visitsRouter = require("./routes/visitRoutes");
app.use("/kulastajad", visitsRouter);

//Külalislogide salvestamise marsruudid
const reqvisitsRouter = require("./routes/reqvisitRoutes");
app.use("/reqvisit", reqvisitsRouter);

//Uudiste vaatamis marsruudid
const newsRouter = require("./routes/newsRoutes");
app.use("/news", newsRouter);

//Uudiste salvestamis marsruudid
const newsuploadRouter = require("./routes/newsuploadRoutes");
app.use("/news_add", newsuploadRouter);

//Konto loomise marsruudid
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

//sisselogimise marsruudid
const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

app.listen(5122);