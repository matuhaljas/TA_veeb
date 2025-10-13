const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp_2025_config");

dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
};

//@desc home page for Estonian film section
//@route GET /Eestifilm
//@access public

//app.get("/Eestifilm", (req, res)=>{
const eestifilm = (req, res)=>{
	res.render("eestifilm");
};

//@desc page for people involved in Estonian film industry
//@route GET /Eestifim/filmiinimesed
//@access public

//app.get("/Eestifilm/filmiinimesed", async (req, res)=>{
const filmiinimesed = async (req, res)=> {
    let conn;
    const sqlReq = "SELECT * FROM person"
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("filmiinimesed", {personList: rows});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("filmiinimesed", {personList: []});
    }
    finally {
        if(conn) {
            await conn.end();
            console.log("Andmebaasiühendus on suletud");
        }
    }
};

//@desc home page for adding people involved in Estonian film industry
//@route GET /Eestifilm/filmiinimesed_add
//@access public

//app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
const filmiinimesedAdd = (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
};


//@desc home page for adding people involved in Estonian film industry
//@route POST /Eestifilm/filmiinimesed_add
//@access public

//app.post("/Eestifilm/filmiinimesed_add", async (req, res)=>{
const filmiinimesedAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
	  res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	}
	
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasiühendus loodud!");
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
		}
		finally {
			if(conn){
			await conn.end();
				console.log("Andmebaasiühendus on suletud!");
			}
		}
	}
};



//app.get("/Eestifilm/filmiinimesed_ametid", (req, res)=>{
const ametid = async (req, res)=>{
	let conn;
	let sqlReq = "SELECT * FROM position"

	try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("filmiinimesed_ametid", {personList: rows});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("filmiinimesed_ametid", {personList: []});
    }
    finally {
        if(conn) {
            await conn.end();
            console.log("Andmebaasiühendus on suletud");
        }
    }
};

//app.get("/Eestifilm/filmiinimesed_ametid_add", (req, res)=>{
const ametidAdd = (req, res)=> {
	res.render("filmiinimesed_ametid_add", {notice: "Ootan sisestust"});
};

//app.post("/Eestifilm/filmiinimesed_ametid_add", (req, res)=>{
const ametidAddPost = async (req, res)=>{
	console.log(req.body)
	let conn;
	//INSERT INTO position (position_name, description) VALUES (?,?)
	let sqlReq = "INSERT INTO position (position_name, description) VALUES (?,?)";
	if(!req.body.nameInput || !req.body.positionDescriptionInput){
	  res.render("filmiinimesed_ametid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	  return;
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasiühendus loodud!");
			
			const [result] = await conn.execute(sqlReq, [req.body.nameInput, req.body.positionDescriptionInput]);
			console.log("Salvestati kirje: " + result.insertId);
			//res.redirect("filmiinimesed_ametid");
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmiinimesed_ametid_add", {notice: "Andmete salvestamine ebaõnnestus"});
		}
		finally {
			if(conn){
			await conn.end();
				console.log("Andmebaasiühendus on suletud!");
			}
		}
	}
};


module.exports = {
    eestifilm,
    filmiinimesed,
    filmiinimesedAdd,
    filmiinimesedAddPost,
	ametid,
	ametidAdd,
	ametidAddPost
}