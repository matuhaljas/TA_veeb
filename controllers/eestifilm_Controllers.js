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

//@desc page for people involved in Estonian film industry
//@route GET /Eestifim/filmiinimesed
//@access public

//app.get("/Eestifilm/filmiinimesed", async (req, res)=>{
const filmid = async (req, res)=> {
    let conn;
    const sqlReq = "SELECT * FROM movie"
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud");
        const [rows, fields] = await conn.execute(sqlReq);
        res.render("filmid", {personList: rows});
    }
    catch(err) {
        console.log("Viga: " + err);
        res.render("filmid", {personList: []});
    }
    finally {
        if(conn) {
            await conn.end();
            console.log("Andmebaasiühendus on suletud");
        }
    }
};

//@desc home page for adding Estonian films
//@route GET /Eestifilm/filmid_add
//@access public

//app.get("/Eestifilm/filmid_add", (req, res)=>{
const filmidAdd = async (req, res)=>{
	res.render("filmid_add", {notice: "Ootan sisestust"});
};

//id, title, production_year, duration, description

const filmidAddPost = async (req, res)=>{
	console.log(req.body)
	let conn;
	//INSERT INTO position (position_name, description) VALUES (?,?)
	let sqlReq = "INSERT INTO movie (title, production_year, duration, description) VALUES (?,?,?,?)";
	if(!req.body.nameInput || !req.body.productionYearInput || !req.body.durationInput || !req.body.descriptionInput){
	  res.render("filmiinimesed_ametid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	  return;
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasiühendus loodud!");
			
			const [result] = await conn.execute(sqlReq, [req.body.nameInput, req.body.productionYearInput, req.body.durationInput, req.body.descriptionInput]);
			console.log("Salvestati kirje: " + result.insertId);
			res.redirect("filmid");
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmid_add", {notice: "Andmete salvestamine ebaõnnestus"});
		}
		finally {
			if(conn){
			await conn.end();
				console.log("Andmebaasiühendus on suletud!");
			}
		}
	}
};

//@desc page for people involved in Estonian film industry
//@route GET /Eestifim/filmiinimesed
//@access public

const kombineeritudAddPost = async (req, res) => {
    let conn;
    const sqlReq = "INSERT INTO person_in_movie (person_id, movie_id, position_id, role) VALUES (?, ?, ?, ?)";
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud.");

        await conn.execute(sqlReq, [
            req.body.personSelect,
            req.body.movieSelect,
            req.body.positionSelect,
            req.body.roleInput || null
        ]);

        //uuesti nimekirjad, et need lehel kuvada
        const [persons] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY last_name");
        const [movies] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
        const [positions] = await conn.execute("SELECT id, position_name FROM `position` ORDER BY position_name");

        res.render("kombineeritud_add", {
            persons,
            movies,
            positions,
            notice: "Seos on lisatud!"
        });
    } catch (err) {
        console.log("Viga seose lisamisel: " + err);
        res.render("kombineeritud_add", {
            persons: [],
            movies: [],
            positions: [],
            notice: "Lisamine ebaõnnestus!"
        });
    } finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus suletud.");
        }
    }
};

// @desc Leht seose lisamiseks (isik–film–amet)
// @route GET /Eestifilm/seosed_add
const kombineeritudAdd = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud.");

        const [persons] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY last_name");
        const [movies] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
        const [positions] = await conn.execute("SELECT id, position_name FROM `position` ORDER BY position_name");

        res.render("kombineeritud_add", {
            persons: persons,
            movies: movies,
            positions: positions,
            notice: "Vali isik, film ja amet."
        });
    } catch (err) {
        console.log("Viga seoste andmete lugemisel: " + err);
        res.render("kombineeritud_add", {
            persons: [],
            movies: [],
            positions: [],
            notice: "Andmete lugemine ebaõnnestus!"
        });
    } finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus suletud.");
        }
    }
};

// @desc Leht, mis kuvab kõik olemasolevad isik–film–amet seosed
// @route GET /Eestifilm/seosed_list
const kombineeritudList = async (req, res) => {
    let conn;
    try {
        conn = await mysql.createConnection(dbConf);
        console.log("Andmebaasiühendus loodud.");

        const sql = `
            SELECT 
                p.first_name, 
                p.last_name, 
                m.title, 
                po.position_name, 
                rel.role
            FROM person_in_movie rel
            JOIN person p ON p.id = rel.person_id
            JOIN movie m ON m.id = rel.movie_id
            JOIN position po ON po.id = rel.position_id
            ORDER BY p.last_name, m.title;
        `;
        const [rows] = await conn.execute(sql);

        res.render("kombineeritud", { relations: rows });
    } catch (err) {
        console.log("Viga seoste kuvamisel: " + err);
        res.render("kombineeritud", { relations: [] });
    } finally {
        if (conn) {
            await conn.end();
            console.log("Andmebaasiühendus suletud.");
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
	ametidAddPost,
	filmid,
	filmidAdd,
	filmidAddPost,
	kombineeritudAdd,
	kombineeritudAddPost,
	kombineeritudList
}