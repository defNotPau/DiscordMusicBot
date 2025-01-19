#import dependencies
import pytubefix
import flask
from yt_dlp import YoutubeDL
import json
import datetime
import os

#the main flask app for API
app = flask.Flask(__name__)

#the app route for downloading videos
@app.route("/<video_name>")
#the function itself
def download_video(video_name):
    #search pytube for the video and select the first
    search = pytubefix.Search(video_name)
    url_list = []
    #iterate over each one and store it in a list
    for video in search.videos:
        #append it to the list
        url_list.append(video.watch_url)
    #return the file after extracting the info
    return flask.send_file("src/output/"+YoutubeDL({'extract_audio': True, 'format': 'bestaudio', 'outtmpl': 'src/output/%(title)s.mp3'}).extract_info(url_list[0],download=True).get('title',None)+".mp3", mimetype="audio/mpeg")


#app route for getting jsonified info for the video
@app.route("/info/<video_name>") 
#again, the function itself
def info(video_name):
    #search youtube for the video
    search = pytubefix.Search(video_name)
    url_list = []
    for video in search.videos:
        url_list.append(video.watch_url)
    #get the info from the video
    info = YoutubeDL().extract_info(url_list[0], download=False)
    video_title = info.get('title',None)
    video_duration = str(datetime.timedelta(seconds=info.get('duration',None)))
    #format it in a json way ;)
    formats = {
            "name": video_title,
            "duration": video_duration
    }
    return json.dumps(formats)
#delete everything in the outputs folder
@app.route("/del")
def delete_files():
    #for each file in the directory delete it
    for file in os.listdir("src/output/"):
        #delete it
        os.remove("src/output/"+file)
    return True


#the execution for the app
if __name__ == '__main__':
   app.run(debug=True)