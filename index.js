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

app.post("/", async (req, res) => {
  try {
    const [listResponse, filterResponse] = await Promise.all([
      axios.get(API_URL + "/list.php?i=list"),
      axios.get(API_URL + "/filter.php?i=" + req.body.type),
    ]);

    const ingredientNames = listResponse.data.drinks.map(
      (drink) => drink.strIngredient1
    );
    const drinks = filterResponse.data.drinks;
    const randomSelect = drinks[Math.floor(Math.random() * drinks.length)];

    res.render("index.ejs", {
      options: ingredientNames,
      result: randomSelect,
    });
  } catch (error) {
    console.error("Failed to make request: ", error.message);
    res.redirect("/");
  }
});







app.listen(port, ()=>{ console.log(`Listening on port ${port}`)});