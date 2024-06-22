import requests
import re
from moviepy.editor import *
from pytube import YouTube
import os
import flask
from flask import Response


app = flask.Flask(__name__)

#function to replace spaces with + for youtube query
def replace_youtube(string):
    main = string.split()
    main_join = "+".join(main)
    return main_join


@app.route("/download/<artist_name>/<track_name>")
def main(track_name,artist_name):
    #main data for functions
    artist = artist_name
    track_name = track_name
    
    #formulate the main query for youtube
    main_query = "https://www.youtube.com/results?search_query="+replace_youtube(artist)+"-"+replace_youtube(track_name)
    print(main_query)
    
    #formulate the link
    query_get = requests.get(main_query)
    video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)
    video_link = "https://youtube.com/watch?v="+video_id[0]
    
    #download video 
    link = YouTube(video_link)
    stream = link.streams.get_lowest_resolution()
    stream.download(filename=track_name+".mp4")
    
    #convert video to audio
    video = VideoFileClip(track_name+".mp4")
    audio = video.audio
    audio.write_audiofile(track_name+".mp3")
    
    #clean up
    os.remove(track_name+".mp4")
    
    
    try:
        return Response(open(track_name+".mp3", "rb"), mimetype="audio/mpeg")

    finally:
        os.remove(track_name+".mp3")

    


if __name__ == '__main__':
   app.run()