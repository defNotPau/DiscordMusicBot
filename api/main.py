import requests
import regex as re
from moviepy.editor import *
from pytube import YouTube
import os
from flask import Flask
import flask
import json



app = Flask(__name__)

#function to replace spaces with + for youtube query
def ytformat(string):
    #make a main string splitted in between whitespaces
    main = string.split()
    #replace the whitespace with a + for youtube
    main_join = "+".join(main)
    return main_join
    
#function for downloading file
def download(url,track_name):
    link = YouTube(url)
    #set the lowest resolution(for faster download speed and it doesnt really matter cause its audio)
    stream = link.streams.get_lowest_resolution()
    stream.download(filename=track_name+".mp4")
    
    #convert video to audio
    video = VideoFileClip(track_name+".mp4")
    audio = video.audio
    #write the mp3
    audio.write_audiofile(track_name+".mp3")
    audio.close()
    video.close()
    os.remove(track_name+".mp4")
    print(link.author)
#the 4o4 page
@app.route("/")
def four():
    return("Ooops, this page doesnt exist go to /help to see existing pages")
#main app route
@app.route("/download/<result>/<artist_name>/<track_name>")
def main_download(track_name,artist_name,result):
    try:
        #artist name
        artist = artist_name
        #track name
        track_name = track_name
        #formulate the main search query for youtube
        main_query = "https://www.youtube.com/results?search_query="+ytformat(artist)+"-"+ytformat(track_name)
        query_get = requests.get(main_query)
        
        #search for video id in response
        video_id = re.search(r"watch\?v=(\S{11})", query_get.text)
        #make a youtube video link
        video_link = "https://youtube.com/watch?v="+video_id[int(result)]
        download(video_link,track_name)
        return flask.send_file("../"+track_name+".mp3", mimetype="audio/mpeg")
    except KeyError:
        return str(-1)
   

#add help route
@app.route("/help")
def help():
    #return help message
    return "To get the mp3 file you go, serverip:5000/artist/track_name and to add spaces just use a +\n Also, to get info about a song go, serverip:5000/artist/track_name and you will get duration, artist, and video title"  

@app.route("/info/<result>/<artist>/<track_name>") 
def info(track_name,artist,result):
    #Process The link so its useable for pytube
    query_get = requests.get("https://www.youtube.com/results?search_query="+ytformat(artist)+"-"+ytformat(track_name))
    #Now transform the video list into ussable links
    video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)
    video_link = "https://youtube.com/watch?v="+video_id[int(result)]
    
    #link for researching info
    link = YouTube(video_link)

    #Exception handling
    try:
        artist_name = link.author
        track = link.title
    except:
        return("Could not find song")
    print(artist_name)
    #get the duration of the mp3
    secs = str(link.length)
    mins = int(secs) // 60
    data = {
        "artist": artist_name,
        "name": track,
        "lenght": str(mins)+":"+secs[:-1],
        "id": track_name
    }
    #return the data
    return json.dumps(data)
@app.route("/del/<id>")
def delete(id):
    os.remove(id)
#start the app
if __name__ == '__main__':
   app.run(debug=True)
