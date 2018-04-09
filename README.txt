When creating a new entity

Step 1:
    CREATE MODEL(Schema)

Step 2:
    ADD Routing TO APP.JS

Step 3:
    CREATE ROUTES

Step 4:
    CREATE VIEWS

------------------------------------------------------------

TO DO LIST:
2. Merchant and Admin Functionality
5. Insurance Type Schema
6. Authentications
11. FIX DATATYPES!!!! UNIQUENESS, VALIDATION, ETC
12. DELETING PRODUCTS causes ERROR ON PURCHASES
    SOLUTION: HIDE INSTEAD OF DELETE
------------------------------------------------------------

Watch out for:
1. res.render()
2. return a page_name for each render to determine active tab
------------------------------------------------------------

MongoDB Commands
> show dbs
> use nodekb
> show collections
> db.collection.find().pretty();

// REMOVE ALL PURCHASES
db.products.update({}, {$unset: {purchases:1}} , {multi: true});
db.users.update({}, {$unset: {purchases:1}} , {multi: true});
db.purchases.remove({});

db.users.update({"name" : "admin"}, {$set: {"is_admin": true}}); //set admin
db.users.update({"name" : "AXA Philippines"}, {$set: {"is_merchant": true}}); //set merchant
db.products.update({"name" : "AXA Lite"}, {$set: {"is_approved": true}}); //set as approved
db.products.updateMany({}, {$set: {is_approved: false}}) //disapprove all
csv npm

//SEED

db.products.insertMany([
    {
        name: "Axa Lite",
        description: "This is our Lite offer.",
        type: "Life Insurance",
        merchant: ObjectId("5ab27c68f4d1f82edc13f6f7"),
        price: 500,
        purchases: [ ],
        is_approved: false,
        is_hidden: false
    },
    {
        name: "Axa Basic",
        description: "This is our Basic offer.",
        type: "Life Insurance",
        merchant: ObjectId("5ab27c68f4d1f82edc13f6f7"),
        price: 800,
        purchases: [ ],
        is_approved: false,
        is_hidden: false
    },
    {
        name: "Axa Premium",
        description: "This is our Premium offer.",
        type: "Life Insurance",
        merchant: ObjectId("5ab27c68f4d1f82edc13f6f7"),
        price: 1000,
        purchases: [ ],
        is_approved: false,
        is_hidden: false
    },
    {
        name: "Axa Silver",
        description: "This is our Silver offer.",
        type: "Life Insurance",
        merchant: ObjectId("5ab27c68f4d1f82edc13f6f7"),
        price: 1200,
        purchases: [ ],
        is_approved: false,
        is_hidden: false
    },
    {
        name: "Axa Gold",
        description: "This is our Gold offer.",
        type: "Life Insurance",
        merchant: ObjectId("5ab27c68f4d1f82edc13f6f7"),
        price: 1500,
        purchases: [ ],
        is_approved: false,
        is_hidden: false
    },
    {
        name: "Axa Platinum",
        description: "This is our Platinum offer.",
        type: "Life Insurance",
        merchant: ObjectId("5ab27c28f4d1f82edc13f6f6"),
        price: 2000,
        purchases: [ ],
        is_approved: false,
        is_hidden: false
    }
]);