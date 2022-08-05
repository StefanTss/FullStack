const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const investments = require("./data")
const R = require("ramda")
const app = express()
const request = require("request")


app.use(bodyParser.json({limit: "10mb"}))



app.get("/investment/all", async (req, res) => {
  const options = {
    url: `${config.financialServiceUrl}/companies`,
    json: true, //little convenience flag to set the requisite JSON headers
    headers: {
     'Authorization': 'hgjhgjh',
     'Accept': 'application/json'
    }
   }
   const newArray =[];
   
  //new array to save the new array with all the users together with the holding names

  request.get(options, (e, r, companies) => {
    if (e) {
      console.error(e)
      res.send(500)
    } else {

      const { curry, lensPath, findIndex, whereEq, propOr, over, mergeLeft } = R;

      const graph = [{"id":"root","children":[{"id":"n1"},{"id":"n2"}]}];
      
      const widthLens = curry((id, data) => lensPath([
        'holdings', 
        findIndex(whereEq({ id }), propOr([], 'holdings', data)),
      ]));
      
      const setValues = widthLens('n1', graph);
      const result = over(setValues, mergeLeft({ width: 100, height: 200 }), graph);
      
      console.log(result);      
// this array will add the holding name to be passed when is called
          for (let item of investments) {
              const object = {
                  id: item.id,
                  userId: item.userId,
                  firstName: item.firstName,
                  lastName: item.lastName,
                  investmentTotal: item.investmentTotal,
                  date: item.date,
                  holdings: []
              }
              for (let holdings of item.holdings) {
                
                  object.holdings.push(companies.filter(x => x.id == holdings.id).map(subList => ({
                    id: holdings.id,
                    investmentPercentage: holdings.investmentPercentage,
                    holdingName: subList.name,
                  })))
              }
              newArray.push(object);
          }

          res.send(newArray) 
    }
  })

  
})



app.get("/investments/:id", (req, res) => {
  const {id} = req.params
  const investment = R.filter(R.propEq("id", id), investments)
  res.send(investment)
})

app.post("/investments/export", (req, res) => {
  console.log("Body received", req.body)
  res.sendStatus(204)
})

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})
