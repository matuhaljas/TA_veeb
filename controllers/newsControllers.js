const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const dbInfo = require("../../../vp_2025_config");

dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
};


//@desc home page for uploading gallery photos
//@route GET /galleryphotupload
//@access public

const newsPage = async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT title, content, photofilename, alttext FROM news WHERE expire > ?";
		currentDate = new Date();
		const [rows, fields] = await conn.execute(sqlReq, [currentDate]);
		console.log(rows);
		let newsData = [];
		for (let i = 0; i < rows.length; i ++){
			let newsPhoto = "empty.png"
			let imagehref = "/images/"
			let altText = "Pilt puudub";
			if(rows[i].photofilename != ""){
				imagehref = "gallery/normal/"
				newsPhoto = rows[i].photofilename;
				if(rows[i].alttext != ""){
					altText = rows[i].alttext;
				}
			};
			newsData.push({title: rows[i].title, content : rows[i].content, src: newsPhoto, alt: altText, href: imagehref});
		}
		res.render("news", {newsData: newsData});
	}
	catch(err) {
		console.log(err)
		res.render("news", {newsData: ""});
	}
	finally {
		if(conn){
	  		await conn.end();
	    	console.log("Andmebaasiühendus on suletud!");
	  }
	}
	//res.render("news", {newsData: newsData});
};

//@desc page for uploading photos to gallery
//@route POST /galleryphotupload
//@access public


module.exports = {
	newsPage
};