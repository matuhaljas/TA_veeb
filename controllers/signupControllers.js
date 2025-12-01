const mysql = require("mysql2/promise");
//const dbInfo = require("../../../vp_2025_config");
const pool = require("../src/dbPool");
const validator = require("validator");
const argon2 = require("argon2");

/*dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
};*/

//@desc home page for sign up
//@route GET /signup
//@access public

const signupPage = (req, res)=>{
	res.render("signup", {notice: "Ootan andmeid"});
};

//@desc page for uploading user account info
//@route POST /signup
//@access public

const signupPagePost = async (req, res)=>{
	let conn;
	let notice = "";
	console.log(req.body);
	//andmete valideerimine
	/*if(
		!req.body.firstNameInput ||
		!req.body.lastNameInput ||
		!req.body.birthDateInput ||
		!req.body.genderInput ||
		!req.body.emailInput ||
		req.body.passwordInput.length < 8 ||
		req.body.passwordInput !== req.body.confirmPasswordInput
	) {
		notice =  "Andmeid on puudu või miski on vigane"
		console.log("Andmeid on puudu või miski on vigane");
		return res.render("signup", {notice: notice});
	}
	*/
	//Puhastame andmed
	const firstName = validator.escape(req.body.firstNameInput.trim());
	const lastName = validator.escape(req.body.lastNameInput.trim());
	const birthDate = req.body.birthDateInput;
	const gender = req.body.genderInput;
	const email = req.body.emailInput.trim();
	const password = req.body.passwordInput;
	const confirmPassword = req.body.confirmPasswordInput;

	//kas kõik on olemas
	if(!firstName || !lastName || !birthDate || !gender || !email || !password || !confirmPassword) {
		notice =  "Andmeid on puudu või miski on vigane"
		//console.log("Andmeid on puudu või miski on vigane");
		return res.render("signup", {notice: notice});
	}
	
	//kas email on korras
	if(!validator.isEmail(email)) {
		notice =  "E-mail on vigane"
		//console.log("Andmeid on puudu või miski on vigane");
		return res.render("signup", {notice: notice});
	}

	//kas parool on piisavalt tugev
	const passwordOptions = {minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1, minSymbols: 0}
	if(!validator.isStrongPassword(password, passwordOptions)) {
		notice =  "Parool on liiga nõrk"
		//console.log("Andmeid on puudu või miski on vigane");
		return res.render("signup", {notice: notice});
	}

	//kas paroolid klapivad
	if(password !== confirmPassword) {
		notice =  "Paroolid ei klapi!"
		//console.log("Andmeid on puudu või miski on vigane");
		return res.render("signup", {notice: notice});
	}

	//kas sünnikuupäev on korrektne
	if(!validator.isDate(birthDate) || validator.isAfter(birthDate)) {
		notice =  "Sünnikuupäev pole reaalne"
		//console.log("Andmeid on puudu või miski on vigane");
		return res.render("signup", {notice: notice});
	}

	try {
		//krüpteerime parooli
		//conn = await mysql.createConnection(dbConf);

		let sqlReq = "SELECT id from users where email = ?"
		//const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
		const [users] = await pool.execute(sqlReq, [req.body.emailInput]);
		if (users.length > 0){
			notice = "Selline kasutaja on juba olemas"
			console.log(notice)
			return res.render("signup", {notice: notice});
		}

		const pwdHash = await argon2.hash(req.body.passwordInput);
		sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES (?,?,?,?,?,?)";
		//const [result] = await conn.execute(sqlReq, [
		const [result] = await pool.execute(sqlReq, [
			req.body.firstNameInput, 
			req.body.lastNameInput, 
			req.body.birthDateInput, 
			req.body.genderInput, 
			req.body.emailInput, 
			pwdHash
		]);
		console.log("Salvestati kasutaja: " + result.insertId);
		res.render("signup", {notice: "Andmed salvestatud"});
	}
	catch(err) {
	  console.log(err);
	  res.render("signup", {notice: "Tekkis viga andmete salvestamisel"});
	}
	finally {
	  /*if(conn){
	  await conn.end();
	    console.log("Andmebaasiühendus on suletud!");
	  }*/
	}
};

module.exports = {
	signupPage,
	signupPagePost
};