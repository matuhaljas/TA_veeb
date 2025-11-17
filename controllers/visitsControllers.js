const fs = require("fs").promises;
const textRef = "public/txt/visitlog.txt";

//@desc Home page for registering a visit
//@route GET /reqvisit
//access public

const visit = async (req, res) => {
  try {
    const data = await fs.readFile(textRef, "utf8");
    const listData = data.split(";").filter((line) => line.trim() !== "");
    res.render("kulastajad", {heading: "Siin on inimesed, kes on märkinud oma külastuse", listData });
  } catch (err) {
    console.log("Viga andmete lugemisel: " + err);
    res.render("kulstajad", { heading: "Siin on inimesed, kes on märkinud oma külastuse", listData: [],});
  }
};


module.exports = {
	visit
};