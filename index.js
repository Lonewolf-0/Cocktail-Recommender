import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




app.get("/", async (req,res)=>{
    try {
      const response = await axios.get(API_URL + "/list.php?i=list");
      const result = response.data;
      var ingredientNames = result.drinks.map((drink) => drink.strIngredient1);
      console.log(ingredientNames);
      res.render("index.ejs", {options:ingredientNames});
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("index.ejs", {
        error: error.message,
      });
    }
});

app.post("/", async(req,res)=>{
	try {
		const response = await axios.get(API_URL + "/list.php?i=list");
    const result = response.data;
    var ingredientNames = result.drinks.map((drink) => drink.strIngredient1);

		// console.log(req.body.type);
		const response2 = await axios.get(API_URL+"/filter.php?i="+req.body.type);
		const result2 = response2.data;
		const randomselect = result2.drinks[Math.floor(Math.random() * result2.drinks.length)];
		//console.log(result2.drinks.length);
		//console.log(randomselect); 

		
		res.render("index.ejs", { 
			options: ingredientNames,
			result: randomselect
		});
	} catch(error) {
		console.error("Failed to make request: ", error.message);
		res.redirect("/");
	}
});







app.listen(port, ()=>{ console.log(`Listening on port ${port}`)});