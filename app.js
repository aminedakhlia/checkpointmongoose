var express = require('express');
var mongoose = require('mongoose');
//const dotenv = require("dotenv");

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//dotenv.config()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* database connection  */
//const uri = process.env.MONGO_URI;
//mongoose.connect(uri,{useNewUrlParser:true,useCreateIndex:true});
//mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true}, (err)=> err ? console.error(err): console.log("connected to the database"))
const uri = "mongodb+srv://RanimAmor:ranim@ranim.gqjkf.mongodb.net/person?retryWrites=true&w=majority";
mongoose.connect(
  uri,
  async(err)=>{
      if(err) throw err;
      console.log("conncted to db")
  }
)


/* create a schema */
let personSchema =new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

    },
    age: Number,
    favoriteFoods: [String],
  }
)

/* create model */

let person = mongoose.model("people", personSchema)

/* Creating a document instance using the Person constructor */
var p1 = new person();
p1.name = "ranim";
p1.age = 22;
p1.favoriteFoods = ["Pasta", "Cheesecake"];
p1.save(function (err, data) {
  if (err) {
    return console.error(err);
  }
  return console.log("created successfully");
});

/* Creating Many Records with model.create() */

person.create(
  [
    {
      name: "skander",
      age: 22,
      favoriteFoods: ["pasta with tuna", "pizza"],
    },
    {
      name: "emna",
      age: 22,
      favoriteFoods: ["cheese", "milkshake vanille"],
    },
    {
      name: "soumaya",
      age: 22,
      favoriteFoods: ["nuggets","cheese"],
    },
  ],
  function (err, data) {
    if (err) {
      return console.error(err);
    }
    return console.log("created successfully");
  }
);


/* Finding all the people having a given name, using Model.find() */
person.find({
  name: "ranim", 
})
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => { 
    console.error(err);
  });


/* Finding just one person which has a certain food in the person's favorites, using Model.findOne() */  
person.findOne({
  favoriteFoods: "cheese", 
})
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.error(err);
  });

/* Finding the (only!!) person having a given _id, using Model.findById() */
  person.findById("61868d51ecf2a34f53a84840") // search query

  .then((doc) => {
    console.log("The person with this id is ")
    console.log(doc)

    
  })
  .catch((err) => {
    console.error(err);
  });



/*Find a person by _id with. Add "hamburger" to the list of the person's favoriteFoods
 Then - inside the find callback - save() the updated person*/

  person.findById("61869b223097a1d81624ab80", (error, result) => {
    if (error) {
      console.log(error);
    } else {
      result.favoriteFoods.push("hamburger");
      result.save((error, updatedResult) => {
        if (error) {
          console.log(error);
        } else {
          console.log("success: adding favourite food");
        }
      });
    }
  });


  /* Find a person by Name and set the person's age to 20 */
person.findOneAndUpdate(
  { name: "emna" },
  { $set: { age: 20} },
  { new: true },
  (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    }

    console.log("updated successfully");
  }
);

/* Delete One Document Using model.findByIdAndRemove */

person.findByIdAndRemove("61869b223097a1d81624ab82", function (err, docs) {
  if (err) {
    console.log(err);
  } else {
    console.log("Removed User : ", docs);
  }
});

/*Delete all the people whose name is “Ranim”*/

person.remove({ name: "ranim" }, (error, JSONStatus) => {
  if (error) {
    console.log(error);
  } else {
    console.log("success : remove", JSONStatus);
  }
});


/*Find people who like burritos. Sort them by name, limit the results to two documents,
 and hide their age. Chain .find(), .sort(), .limit(), .select(), and then .exec()*/
 person.find({ favoriteFoods: { $all: ["cheese"] } })
 .sort({ name: "asc" })
 .limit(2)
 .select("-age")
 .exec((error, filteredResults) => {
   if (error) {
     console.log(error);
   } else {
     console.log("find/sort/limit/select : success", filteredResults);
   }
 });
var server = app.listen( 3000, () => {

    console.log('Server is started on localhost:'+ (3000))
  })
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
