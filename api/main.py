import requests
import re
from moviepy.editor import *
from pytube import YouTube
import os
from flask import Response,Flask


app = Flask(__name__)

#function to replace spaces with + for youtube query
def replace_youtube(string):
    #make a main string splitted in between whitespaces
    main = string.split()
    #replace the whitespace with a + for youtube
    main_join = "+".join(main)
    return main_join

#main app route
@app.route("/download/<artist_name>/<track_name>")
def main(track_name,artist_name):
    #main data for functions
    #artist name
    artist = artist_name
    #track name
    track_name = track_name
    
    #formulate the main search query for youtube
    main_query = "https://www.youtube.com/results?search_query="+replace_youtube(artist)+"-"+replace_youtube(track_name)
    
    #formulate the link
    query_get = requests.get(main_query)
    #search for video id in response
    video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)
    #make a youtube video link
    video_link = "https://youtube.com/watch?v="+video_id[0]
    
    #download video 
    link = YouTube(video_link)
    #set the lowest resolution(for faster download speed and it doesnt really matter cause its audio)
    stream = link.streams.get_lowest_resolution()
    stream.download(filename=track_name+".mp4")
    
    #convert video to audio
    video = VideoFileClip(track_name+".mp4")
    audio = video.audio
    #write the mp3
    audio.write_audiofile(track_name+".mp3")
    
    #clean up
    os.remove(track_name+".mp4")
    
    #use try so you can clean up the mp3
    try:
        #return file
        return Response(open(track_name+".mp3", "rb"), mimetype="audio/mpeg")

    finally:
        #clean up mp3
        os.remove(track_name+".mp3")
#add help route
@app.route("/help")
def help():
    #return help message
    return "To get the mp3 file you go, serverip:5000/track_name/artist name and to add spaces just use a +"    


if __name__ == '__main__':
   app.run()