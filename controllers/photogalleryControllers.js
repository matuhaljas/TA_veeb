const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp_2025_config");

dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
};


//@desc home page for gallery photos
//@route GET /photogallery
//@access public

const photoGallery = async (req, res)=>{
	/*
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT file_name, alt_text FROM gallery_photos WHERE privacy >= ? AND deleted IS NULL";
		const privacy = 2;
		const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alttext != ""){
				altText = rows[i].alt_text;
			}
			galleryData.push({src: rows[i].file_name, alt: altText});
		}
		res.render("photogallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/"});
	}
	catch(err) {
		console.log(err)
	}
	finally {
		if(conn){
	  		await conn.end();
	    	console.log("Andmebaasiühendus on suletud!");
	  }
	}
	*/
	res.redirect("/photogallery/1");
};


const galleryPage = async (req, res)=>{
	let conn;
	const photoLimit = 4
	const privacy = 2;
	let page = parseInt(req.params.page);
	//let skip = 0;

	try {
		//kontrollin, et poleks liiga väike lehekülg
		if(page < 1 || isNaN(page)){
			page = 1;
		}
		//Vaatame palju üldse fotosid on
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT COUNT(id) AS photos FROM gallery_photos WHERE privacy >= ? AND deleted IS NULL";
		const [countResult] = await conn.execute(sqlReq, [privacy]);
		const photoCount = countResult[0].photos;

		//parandame lehekülje numbri kui see on valitud liiga suur
		if((page - 1) * photoLimit >= photoCount){
			page = Math.max(1, Math.ceil(photoCount / photoLimit));
		}
		let skip = (page - 1) * photoLimit;

		//Navigatsiooni linkide loomine
		if(page == 1){
			galleryLinks = "Esimene leht &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;";
		} else {
			galleryLinks = `<a href="/photogallery/${page - 1}"> Eelmine leht &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;</a>`;
		}
		if(page * photoLimit >= photoCount){
			galleryLinks += "Järgmine leht";
		} else {
			galleryLinks += `<a href="/photogallery/${page + 1}">Järgmine leht</a>`;
		}
		console.log(galleryLinks)
		//Fotode andmebaasist lugemine
		sqlReq = "SELECT file_name, alt_text FROM gallery_photos WHERE privacy >= ? AND deleted IS NULL LIMIT ?, ?";
		const [rows, fields] = await conn.execute(sqlReq, [privacy, skip, photoLimit]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alttext != ""){
				altText = rows[i].alt_text;
			}
			galleryData.push({src: rows[i].file_name, alt: altText});
		}
		res.render("photogallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/", links: galleryLinks});
	}
	catch(err) {
		console.log(err)
		res.render("photogallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/", links: ""});
	}
	finally {
		if(conn){
	  		await conn.end();
	    	console.log("Andmebaasiühendus on suletud!");
	  }
	}
};

module.exports = {
	photoGallery,
	galleryPage
};