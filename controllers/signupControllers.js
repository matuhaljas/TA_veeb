const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp_2025_config");
const argon2 = require("argon2");

dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
};

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
	console.log(req.body);
	//andmete valideerimine
	if(
		!req.body.firstNameInput ||
		!req.body.lastNameInput ||
		!req.body.birthDateInput ||
		!req.body.genderInput ||
		!req.body.emailInput ||
		req.body.passwordInput.length < 8 ||
		req.body.passwordInput !== req.body.confirmPasswordInput
	) {
		let notice =  "Andmeid on puudu või miski on vigane"
		console.log("Andmeid on puudu või miski on vigane");
		return res.render("signup", {notice: notice});
	}

	try {
		//krüpteerime parooli
		const pwdHash = await argon2.hash(req.body.passwordInput);
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES (?,?,?,?,?,?)";
		const [result] = await conn.execute(sqlReq, [
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
	  if(conn){
	  await conn.end();
	    console.log("Andmebaasiühendus on suletud!");
	  }
	}
};

module.exports = {
	signupPage,
	signupPagePost
};