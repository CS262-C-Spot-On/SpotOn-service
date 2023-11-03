SELECT 
* 
FROM LogIn;

SELECT 
* 
FROM Playlist;

SELECT 
* 
FROM Song;

SELECT 
*
FROM Playlist
WHERE email = 'LogIn_email_address';

--retrieve the song that appears in most playlists for a given LogIn (favorite song?)
SELECT Song.title, Song.artist
FROM Song
JOIN PlaylistSong ON Song.songID = PlaylistSong.song_ID
JOIN Playlist ON Playlist.playlistID = PlaylistSong.playlist_ID
WHERE Playlist.email = 'LogIn_email_address'
GROUP BY Song.songID, Song.title, Song.artist
ORDER BY COUNT(*) DESC
LIMIT 1;


SELECT 
* 
FROM LogIn, Playlist, Song, PlaylistSong;
