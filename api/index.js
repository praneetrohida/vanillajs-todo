var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/todo";

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get("/tasks", function(req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("tasks").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result));
      db.close();
    });
  });
});

app.post("/tasks", function(req, res) {
  var caption = req.body.caption;
  var obj = {
    caption: caption,
    completed: false
  };
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("tasks").insertOne(obj, function(err, result) {
      if (err) throw err;
      db.close();

      res.send();
    });
  });
});

app.post("/tasks/edit/:id", function(req, res) {
  var id = new ObjectID.createFromHexString(req.params.id);

  var caption = req.body.caption;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db
      .collection("tasks")
      .updateOne({ _id: id }, { $set: { caption: caption } }, function(
        err,
        result
      ) {
        res.send();
        db.close();
      });
  });
});

app.post("/tasks/delete/:id", function(req, res) {
  var id = new ObjectID.createFromHexString(req.params.id);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("tasks").deleteOne({ _id: id }, function(err, result) {
      if (err) throw err;
      db.close();
      res.send();
    });
  });
});

app.post("/tasks/toggle/:id", function(req, res) {
  var id = new ObjectID.createFromHexString(req.params.id);
  var completed = false;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("tasks").findOne({ _id: id }, function(err, result) {
      completed = !result.completed;
      db
        .collection("tasks")
        .findOneAndUpdate(
          { _id: id },
          { $set: { completed: completed } },
          function(err, result) {
            db.close();
            res.send();
          }
        );
    });
  });
});

app.listen(3001);
