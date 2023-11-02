DROP TABLE IF EXISTS PlaylistSong;

DROP TABLE IF EXISTS Playlist;

DROP TABLE IF EXISTS Song;

DROP TABLE IF EXISTS LogIn;

CREATE TABLE
    LogIn (
        emailAddress varchar(50) PRIMARY KEY,
        password varchar(30)
    );

CREATE TABLE
    Playlist (
        playlistID integer PRIMARY KEY,
        name varchar(50),
        spotifyLink varchar(100) NOT NULL,
        email varchar(50) REFERENCES LogIn(emailAddress)
    );

CREATE TABLE
    Song(
        songID integer PRIMARY KEY,
        title varchar(50),
        artist varchar(50),
        duration integer
    );

CREATE TABLE
    PlaylistSong(
        playlist_ID integer REFERENCES Playlist(playlistID),
        song_ID integer REFERENCES Song(songID),
        PRIMARY KEY (playlist_ID, song_ID)
    );

INSERT INTO LogIn VALUES ('heyab.robel@gmail.com', 'password123');

INSERT INTO
    Playlist(
        playlistID,
        name,
        email,
        spotifylink
    )
VALUES (
        1,
        'First',
        'heyab.robel@gmail.com',
        'https://spotify.com'
    );

INSERT INTO
    Song(songID, title, artist, duration)
VALUES (
        1,
        'Song Title',
        'Artist Name',
        240
    );

INSERT INTO PlaylistSong(playlist_ID, song_ID) VALUES (1, 1);
