"use strict";

/*
We know for a fact that the database will be called on every lambda invocation,
so it makes sense to do this first and above the handlers
*/

// TODO: the connection data should be alternatively retrievable from an environment var
const mysql = require('serverless-mysql')({
  config: {
	host     : 'ppt-db.cgskb9n9pyxb.us-east-1.rds.amazonaws.com',
    user     : 'admin',
    password : 'p1nG-P0wnG!T4hlee',
	database: 'ppt'
  }
})





//connection.connect();


module.exports.read = async (event) => {
	
	
	    return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "SUCCESS: READ",
        data: await mysql.transaction()
		.query("SELECT * FROM game")
		.commit(),
      },

    ),
  };
};

module.exports.add_game = async (event) => {
	var data = JSON.parse(event.body);
	console.log(data);
	data.p1score = parseInt(data.p1score);
	data.p2score = parseInt(data.p2score);
	
	for(var x in data) //sanitize, quick and dirty
		data[x] = mysql.escape(data[x]);
		
	var datastring = data.p1name + ',' + data.p1score + ',' + data.p2name + ',' + data.p2score;
	

    return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "SUCCESS: ADD",
        data: await mysql.transaction()
		.query("INSERT into game (p1name, p1score, p2name, p2score) VALUES (" + datastring + ")")
		.query("SELECT * FROM game")
		.commit(),
      },

    ),
  };
	

};

module.exports.edit_game = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "SUCCESS: EDIT",
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.del_game = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "SUCCESS: DEL",
        input: event,
      },
      null,
      2
    ),
  };
};
