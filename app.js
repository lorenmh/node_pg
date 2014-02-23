pg = require("pg");
express = require("express");

app = express();

// role = node_pg, password = 1234, ... database = node_pg
var dbUri = "postgres://node_pg:1234@localhost:5432/node_pg";

var client = new pg.Client(dbUri);

client.connect(function(error) {
  if (error) {
    return console.error("connection error", error);
  }
})

var initializeTable = function() {
  var tableInitString = 
    "CREATE TABLE IF NOT EXISTS contact (" +
      "id serial primary key," +
      "name varchar(128)," +
      "email varchar(128)," +
      "message text," +
      "time timestamptz not null default now()" +
    ");";

  client.query(tableInitString, function(error) {
    if (error) {
      return console.error("table init error", error);
    }
  });
};

var insertContact = function(name, email, message) {
  var insertString = 
    "INSERT INTO contact(name, email, message) VALUES($1,$2,$3)";
  var insertArray = [name, email, message];

  client.query(insertString, insertArray, function(error) {
    if (error) {
      return console.error("row insert error", error);
    }

    client.end();
    console.log("Inserted into table, " + name + ", " + email + ".")
  });
}

var emailFieldValid = function(string) {
  var at = string.indexOf('@');
  var period = string.indexOf('.');
  if (at > 0) {
    if (period > at + 1 && period < string.length - 1) {
      return true;
    }
  }
  return false;
}

// Could use /^([A-z]|\s)+$/ to include only letters and spaces,
// but I am going to just return true for the time being (Umlauts? Accents? etc)
var nameFieldValid = function(string) {
  if (string.length > 0) {
    return true;
  } else {
    return false;
  }
}

var messageFieldValid = function(string) {
  if (string.length > 0) {
    return true;
  } else {
    return false;
  }
}

var checkValidForm = function(obj) {

  if (!nameFieldValid(obj.name)) {
  }
}