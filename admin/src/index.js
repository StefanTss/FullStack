

const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const request = require("request")
const json2csv = require('json2csv');
const app = express()


app.use(bodyParser.json({limit: "10mb"}))

app.get("/investments/:id", (req, res) => {
  const {id} = req.params
  request.get(`${config.investmentsServiceUrl}/investments/${id}`, (e, r, investments) => {
    if (e) {
      console.error(e)
      res.send(500)
    } else {
      res.send(investments)
    }
  })
})

//get all the investments and display them
app.get("/investment/all", (req, res) => {
  const options = {
    url: `${config.investmentsServiceUrl}/investment/all`,
    json: true, //little convenience flag to set the requisite JSON headers
    headers: {
     'Authorization': 'hgjhgjh',
     'Accept': 'application/json'
    }
   }
  request.get(options, (e, r, investments) => {
    if (e) {
      console.error(e)
      res.send(500)
    } else {

      // const headers = [
      //   { label: "User", key: "userId" },
      //   { label: "First Name", key: "firstName" },
      //   { label: "Last Name", key: "lastName" },
      //   { label: "Date", key: "date" },
      //   { label: "Holding", key: "holdingName" },
      //   { label: "Value", key: "investmentPercentage" }
      // ];
       
      // // |User|First Name|Last Name|Date|Holding|Value|  
      // // value=investmentTotal * investmentPercentage
      // const csvReport = {
      //   data: investments,
      //   headers: headers,
      //   filename: 'testInvestment.csv'
      // };
      const data = investments.map(item => ({
        userId: item.userId,
        firstName: item.firstName,
        lastName: item.firstName,
        date: item.firstName,
        holdingName: item.holdings.map(role => role.holdingName),
        investmentPercentage: item.holdings.map(role => item.investmentTotal*role.holdingName),
      }))

      var { Parser } = require('json2csv')

        const fields = [{
            label: 'User',
            value: 'userId'
        }, {
            label: 'First Name',
            value: 'firstName'
        }, {
          label: 'Last Name',
          value: 'lastName'
      }, {
        label: 'Date',
        value: 'date'
    }, {
      label: 'Holding',
      value: 'holdingName'
  }, {
    label: 'Value',
    value: 'investmentPercentage'
}]

        const json2csv = new Parser({ fields: fields })

        try {
            const csv = json2csv.parse(data)
            res.attachment('data.csv')
            res.status(200).send(csv)
        } catch (error) {
            console.log('error:', error.message)
            res.status(500).send(error.message)
        }
      //  res.send(downloadFile)
    }
  })
})

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})




