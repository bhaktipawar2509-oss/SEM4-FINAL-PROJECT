const express = require('express')
const USER = require('./Models/userModel')
const FOODITEMS = require('./Models/foodModel')
const ConnectDB = require('./Database/dbConnection.js')
const cors = require('cors')

const app = express()

app.use(express.json()) // middleware
app.use(cors())


// Database connection
ConnectDB()

app.get("/", function (request, response) {
    response.send("Welcome to BCAQuickBite Backend Server")
})






app.post("/api/user/login", function (request, response) {

    console.log('Login DAta from Client: ', request.body)

    USER.findOne({ email: request.body.email, password: request.body.password })
        .then(function (result) {
            console.log("Data in Database: ", result)

            if (result) {
                response.status(200).send({ message: "Login Successfull", data: result })
            }
            else {
                response.status(202).send({ message: "Invalid Credentials" })
            }
        })
        .catch(function (err) {
            console.log("Error in Login:", err)
        })
})










app.post("/api/user/register", function (request, response) {

    console.log("Data from Register Form: ", request.body)

    USER.findOne({ email: request.body.email })
        .then(function (result) {
            if (result) {
                response.status(203).json({ message: "User Account Already Exist!" })
            }
            else {

                USER.insertOne(request.body)
                    .then(function (res) {
                        console.log("User data is inserted successfully: ", res)
                        response.status(200).json({ message: "User Registered Successfully" })
                    })
                    .catch(function (err) {
                        console.log("Error while inserting user data: ", err)
                    })

            }
        })
        .catch(function () {
            console.log("Some Error in REgister")
        })



})


app.post("/api/food/addFoodItem", function (request, response) {
    console.log("Add Food Data fron Frontend: ", request.body)

    FOODITEMS.insertOne(request.body)
        .then(function (result) {
            console.log('Result data from Add Food Item: ', result)
            response.status(200).json({ message: "Inserted data successfully" })
        })
        .catch(function (error) {
            console.log("Got some error while adding food item: ", error)
            response.send("Got some error while adding food item")
        })

})



app.get('/api/food', function (request, response) {
    console.log('Queries from frotend: ', request.query)
    let { filterQuery, searchQuery } = request.query

    if (filterQuery === 'all' && searchQuery === "") {
        FOODITEMS.find()
            .then(function (result) {
                response.json(result)
            })
            .catch(function (error) {
                response.json({ message: "Failed to fetch food data", err: error })
            })
    }
    else if (filterQuery === 'all' && searchQuery !== '') {
        FOODITEMS.find({ name: { $regex: searchQuery, $options: "i" } })
            .then(function (result) {
                response.json(result)
            })
            .catch(function (error) {
                response.json({ message: "Failed to fetch food data", err: error })
            })

    }
    else {
        FOODITEMS.find({ name: { $regex: searchQuery, $options: "i" }, category: { $regex: filterQuery, $options: "i" } })
            .then(function (result) {
                response.json(result)
            })
            .catch(function (error) {
                response.json({ message: "Failed to fetch food data", err: error })
            })


    }

})


app.delete("/api/food/deleteFoodItem/:id", function (request, response) {
    console.log("Delete API is working, ID: ", request.params)

    FOODITEMS.deleteOne({ _id: request.params.id })
        .then(function (result) {
            console.log('Delete api result: ', result)
            response.status(200).json({ message: "deleted data successfully" })
        })
        .catch(function (error) {
            console.log("Got some error in Delete API: ", error)
            response.send('Got some error while deleting food item')
        })

})



const PORT = 8000
app.listen(PORT, function (error) {
    console.log(`Your Server is running in http://localhost:${PORT}`)
})