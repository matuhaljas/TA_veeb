const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../vp_2025_config");
const watermarkFile = "./public/images/vp_logo_small.png";

dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
};


//@desc home page for uploading news
//@route GET /news_add
//@access public

const newsuploadPage = (req, res)=>{
	res.render("news_add");
};

//@desc page for uploading news
//@route POST /news_add
//@access public

const newsuploadPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {

		const fileName = "vp_" + Date.now() + ".jpg";
		//Kontrollime, kas laeti ülesse pildi fail uudisega
		if (req.body.photoInput !== "") {
			console.log(fileName);
			await fs.rename(req.file.path, req.file.destination + fileName);
			//kontrollin, kas vesimärgi fail on olemas
				const watermarkSettings = [{
					input: watermarkFile,
					gravity: "southeast"
				}];
				if (!await fs.access(watermarkFile).then(() => true).catch(() => false)) {
					console.log("Vesimärgi faili ei leitud!");
					// Tühjendame seaded, et vesimärki ei proovitaks lisada
					watermarkSettings.length = 0; 
				}
				console.log("Muudan suurust: 800X600");
				//loon normaalmõõdus foto (800X600)
				let normalImageProcessor = await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90});
				console.log("Lisan vesimärgi" + watermarkSettings.length);    
				if (watermarkSettings.length > 0) {
					normalImageProcessor = await normalImageProcessor.composite(watermarkSettings);
				}
				await normalImageProcessor.toFile("./public/gallery/normal/" + fileName);
			//loon thumbnail pildi 100X100
			await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
			conn = await mysql.createConnection(dbConf);
			let sqlReq = "INSERT INTO gallery_photos (file_name, orig_name, alt_text, privacy, user_id) VALUES(?,?,?,?,?)";
			//kuna kasutajakontosid veel ei ole, siis määrame userid = 1
			const userId = 1;
			const privacy = 3
			const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, privacy, userId]);
			console.log("Salvestati kirje: " + result.insertId);
		}

		//Lisame uudise andmebaasi
		//conn = await mysql.createConnection(dbConf);
		if(req.body.photoInput == "") {

			console.log(req.body)

			const userId = 1;
			let sqlReq = "INSERT INTO news (title, content, expire, userid) VALUES (?,?,?,?)"
			const [result] = await conn.execute(sqlReq, [
			req.body.titleInput, 
			req.body.contentInput, 
			req.body.expireInput, 
			userId
		]);
		console.log("Salvestati uudis: " + result.insertId);
		} else {
			let altText = "Pildi sisu puudub"
			if(req.body.altInput){
				altText = req.body.altInput
			}
			const userId = 1;

			console.log(req.body)

			let sqlReq = "INSERT INTO news (title, content, expire, photofilename, alttext, userid) VALUES (?,?,?,?,?,?)"
			const [result] = await conn.execute(sqlReq, [
			req.body.titleInput, 
			req.body.contentInput, 
			req.body.expireInput, 
			fileName, 
			altText, 
			userId
		]);
		console.log("Salvestati uudis: " + result.insertId);
		}
		res.render("news_add");
	}
	catch(err) {
	  console.log(err);
	  res.render("news_add");
	}
	finally {
	  if(conn){
	  await conn.end();
	    console.log("Andmebaasiühendus on suletud!");
	  }
	}
};

module.exports = {
	newsuploadPage,
	newsuploadPagePost
};