const express = require("express");
const cors = require("cors")
const fs = require("fs")
const quotes = require("./quotes.json");

const app = express();

app.use(cors())
app.use(express.json());

app.get('/', function(request, response) {
  response.send('/quotes/17 should return one quote, by id')
});

    //POST
    
    const quotesFile = "./quotes.json"

    const saveQuotesToJson = (q) => {
      const text = JSON.stringify(q, null, 4)
      fs.writeFileSync(quotesFile, text)

    };
    const getQuotesFromJson = () => {
     // the quotes are inside the quotes.json
      // read the file
      const text = fs.readFileSync(quotesFile);
      // parse the text to a json OBJECT
      const obj = JSON.parse(text);
    
      return obj;
    };
  

    const saveQuote = (request, response) => {
      const newQuote = request.body;

      console.log(' ---' +  request.body);
      const quotes = getQuotesFromJson();   // what is job of this code ?
      //console.log(quotes);
      // create a function to check A quote already exist or Not.
      // providing unique id for the new quote.
        const maxId = Math.max(...quotes.map((quoteEle) => quoteEle.id))
        newQuote.id  = maxId + 1;

      // saving quotes.
      quotes.push(newQuote)
      saveQuotesToJson(quotes)
      response.status(201).send(newQuote)
    };
// -------------------------------------------------
// -----PUT-------------

const getPostQuote=(req, res )=>{
  let id = req.params.id
  console.log(req.params.id);
  let foundId = quotes.find((quote) => quote.id == id)
  //console.log(foundId);

  foundId.quote = req.body.quote
  foundId.author = req.body.author
  console.log(  foundId);

  res.send(foundId)

}

//DELETE
  const deleteFunc= (req, res)=> {
    const reqId = parseInt(req.params.id)
    const deleteQuote = quotes.find((element)=> element.id == reqId)
    
    if(deleteQuote){
      let quotesNotDeleted =  quotes.filter((quote) =>  quote.id !== deleteQuote.id)

      console.log(quotesNotDeleted);
      res.send(quotesNotDeleted)
    }else{
      console.log(deleteQuote);
      return res.status(400).send("Please check your request again")
    }

  }  

 
//  //GET -----------------
const filterWithId =(req, res )=>{
  const reqId = parseInt(req.params.id)

  const quote = quotes.find((element)=> element.id === reqId) 

  if(quote){
    return res.send(quote)
  }else{
    res.status(404).send("Could not find it.")
  }
}


app.get("/quotes/:id", filterWithId)
app.post("/quotes/", saveQuote)
app.put("/quotes/:id", getPostQuote)
app.delete("/quotes/:id", deleteFunc)

app.listen(3005, () => console.log("Listening on port 3005"));
