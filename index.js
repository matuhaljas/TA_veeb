const express = require("express");
const fs = require("fs");
const mysql = require("mysql2/promise");
//päringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
//SQL andmebaasi moodul
//kuna kasutame asunc siis impordime msql2/promise mooduli
//const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
//const dbInfo = require("../../vp_2025_config");
const textRef = "public/txt/vanasonad.txt";
const kulastajadRef = "public/txt/visitlog.txt"

//käivitan express.js funktsiooni ja annan nime app
const app = express();

//määran veebilehe renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));
//parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: false}));

app.get("/", async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT file_name, alt_text FROM gallery_photos WHERE id=(SELECT MAX(id) FROM gallery_photos WHERE privacy=? AND deleted IS NULL)";
		const privacy = 3;
		const [rows, fields] = await conn.execute(sqlReq, [privacy]);
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
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
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

/*
//Uudiste salvestamis ja vaatamis marsruudid
const newsRouter = require("./routes/newsRoutes");
app.use("/news", newsRouter);
*/

//Konto loomise marsruudid
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

app.listen(5122);