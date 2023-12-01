# SpotOn-service

The database is relational with the schema specified in the sql/ sub-directory and is hosted on ElephantSQL. The database server, user and password are stored as Azure application settings so that they aren’t exposed in this (public) repo.

The following URLs are active for our data service:

https://spoton.azurewebsites.net/

https://spoton.azurewebsites.net/users

https://spoton.azurewebsites.net/users/:email

The other links that will be active are not too important for the core functionality of our app and will be up and running once we need them.
We will have the following URLs once implemented:

https://spoton.azurewebsites.net/playlists

https://spoton.azurewebsites.net/playlists/:playlistID

https://spoton.azurewebsites.net/songs

https://spoton.azurewebsites.net/songs/:songID
