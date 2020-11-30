# Boardgames

Cloud Application API Project

Node backend. Google Cloud datastore database (NoSQL). Tested using Postman.

Backend API includes restful routes, authentication, authorization, validation, pagination, detailed error statuses and messages.

There is a minimal frontend for a user to get a JWT using Google sign in.

# Models

TODO

# Restful Routes

**Users**

GET /users  
GET /users/:userID  
POST /users  

**Boardgames**

GET /boardgames  
GET /boardgames/:boardgameID  
POST /boardgames  
PUT /boardgames/:boardgameID  
PATCH /boardgames/:boardgameID  
DELETE /boardgames/:boardgameID  

**Plays**

GET /plays  
GET /plays/:playID  
POST /plays  
PUT /plays/:playID  
PATCH /plays/:playID  
PATCH /plays/:playID/boardgames/:boardgameID  
DELETE /plays/:playID  
DELETE /plays/:playID/boardgames/:boardgameID  

# Reflection on work

I went beyond the assigned project goals but due to time constraints, I left some work unpolished. Unsure If I will ever fix these issues but I wanted to document HACKs and TODOs incase anyone finds this open source work useful.

**HACKs**

1. I hard coded the url on the frontend and backend instead of setting one env var in gcloud. See util.js "getURL" and /views/login.handlebars
2. INDEX performs 2 database queries. One query to get the total number of items and a second query to only return the 5 paginated items. These tasks can be completed using one query.

**TODOs**

1. Play model is the only model that does not validate or provide error messages for req.body values. e.g. "2010-13-1" would be an incorrectly accepted "dateStarted" but a missing "dateStarted" key would return a 400 status and error message.
2. Validate adding a relation between Boardgame and Play. A Play with 5 players can be incorrectly related to a boardgame with 2-4 players possible.
3. Play only stores boardgame id. Would be nice to also store boardgame name.
4. Move duplicated code in UsersController.js to a UsersMiddleware.js file to keep code dry.
5. Add created_at and updated_at attributes.
6. Fix HACKs.