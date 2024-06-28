import requests
import regex as re
from moviepy.editor import *
from pytube import YouTube
import os
from flask import Response,Flask, stream_with_context
from mutagen.mp3 import MP3
import flask
import json

app = Flask(__name__)

def yformat(data):
    if type(data) is not str:
        return
    
    return data.replace(' ', '+')

def download(url,track_name):
    link = YouTube(url)

    stream = link.streams.get_lowest_resolution()
    stream.download(filename="./api/output/"+track_name+".mp4")

    video = VideoFileClip("./api/output/"+track_name+".mp4")
    audio = video.audio

    audio.write_audiofile("./api/output/"+track_name+".mp3")
    audio.close()
    video.close()
    os.remove("./api/output/"+track_name+".mp4")

    seconds = link.length

    minutes = seconds // 60
    remaining_seconds = seconds % 60

    return (link.title, f"{minutes:02}:{remaining_seconds:02}", link.author)

@app.route("/download/<track_name>")
def main_download(track_name):
    main_query = "https://www.youtube.com/results?search_query="+yformat(track_name)
    query_get = requests.get(main_query)
    
    video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)

    video_link = "https://youtube.com/watch?v="+video_id[0]
    video_info = download(video_link,track_name)
    jsondic = {"name": video_info[0],"duration": video_info[1],"author":video_info[2]}
    
    return (json.dumps(jsondic))

@app.route("/download/<track_name>/<artist_name>")
def full_download(track_name, artist_name):
    main_query = "https://www.youtube.com/results?search_query="+yformat(artist_name)+"-"+yformat(track_name)
    query_get = requests.get(main_query)

    video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)

    video_link = "https://youtube.com/watch?v="+video_id[0]
    video_name = download(video_link,track_name)

    return flask.send_file("../"+track_name+".mp3", mimetype="audio/mpeg")

if __name__ == '__main__':
   app.run(debug=True)

