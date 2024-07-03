import requests
import regex as re
from moviepy.editor import *
from pytube import YouTube
import os
import os.path
from flask import Flask
import json

app = Flask(__name__)

def yformat(data):
    if type(data) is not str:
        return
    
    return data.replace(' ', '+')

def download(url,track_name):
    link = YouTube(url)
    seconds = link.length
    minutes = seconds // 60
    remaining_seconds = seconds % 60

    print(os.path.exists(f"./api/output/{track_name}.mp3"))

    if os.path.exists(f"./api/output/{track_name}.mp3") == True:
        print('e')
        return (link.title, f"{minutes:02}:{remaining_seconds:02}", link.author)

    stream = link.streams.get_lowest_resolution()
    stream.download(filename="./api/output/"+track_name+".mp4")

    video = VideoFileClip("./api/output/"+track_name+".mp4")
    audio = video.audio

    audio.write_audiofile("./api/output/"+track_name+".mp3")
    audio.close()
    video.close()
    os.remove("./api/output/"+track_name+".mp4")

    return (link.title, f"{minutes:02}:{remaining_seconds:02}", link.author)

@app.route("/download/<track_name>")
def main_download(track_name):
    main_query = "https://www.youtube.com/results?search_query="+yformat(track_name)
    query_get = requests.get(main_query)
    
    video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)

    video_link = "https://youtube.com/watch?v="+video_id[0]
    video_info = download(video_link,track_name)
    jsondic = {"name": str(video_info[0].encode(encoding="ascii",errors="xmlcharrefreplace")).strip("b'"),"duration": video_info[1],"author":str(video_info[2].encode(encoding="ascii",errors="xmlcharrefreplace")).strip("b'"), "id": track_name}
    
    return (json.dumps(jsondic))

@app.route("/download/<track_name>/<artist_name>")
def full_download(track_name, artist_name):
    main_query = "https://www.youtube.com/results?search_query="+yformat(artist_name)+"-"+yformat(track_name)
    query_get = requests.get(main_query)

    video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)

    video_link = "https://youtube.com/watch?v="+video_id[0]
    video_info = download(video_link,track_name)
    jsondic = {"name": str(video_info[0].encode(encoding="ascii",errors="xmlcharrefreplace")).strip("b'"),"duration": video_info[1],"author": str(video_info[2].encode(encoding="ascii",errors="xmlcharrefreplace")).strip("b'"), "id": track_name}

    return (json.dumps(jsondic))

if __name__ == '__main__':
   app.run(debug=True)

