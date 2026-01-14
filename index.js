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

		// Get full details for the selected drink
		const response3 = await axios.get(API_URL + "/lookup.php?i=" + randomselect.idDrink);
		const fullDrink = response3.data.drinks[0];

		// Process ingredients
		let ingredients = [];
		for (let i = 1; i <= 15; i++) {
			if (fullDrink[`strIngredient${i}`]) {
				ingredients.push({
					name: fullDrink[`strIngredient${i}`],
					measure: fullDrink[`strMeasure${i}`]
				});
			}
		}

		res.render("index.ejs", { 
			options: ingredientNames,
			result: fullDrink,
			ingredients: ingredients
		});
	} catch(error) {
		console.error("Failed to make request: ", error.message);
		res.redirect("/");
	}
});







app.listen(port, ()=>{ console.log(`Listening on port ${port}`)});