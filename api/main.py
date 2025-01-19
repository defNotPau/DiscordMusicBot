import pytubefix
import flask
import json
import datetime
import os

from yt_dlp import YoutubeDL
app = flask.Flask(__name__)


@app.route("/<video_name>")
def download_video(video_name):
    #search pytube for the video and select the first
    search = pytubefix.Search(video_name)
    url_list = []
    #iterate over each one and store it in a list
    for video in search.videos:
        #append it to the list
        url_list.append(video.watch_url)
    #return the file after extracting the info
    return flask.send_file("./output/"+YoutubeDL({'extract_audio': True, 'format': 'bestaudio', 'outtmpl': 'api/output/%(id)s.mp3'}).extract_info(url_list[0],download=True).get('title',None)+".mp3", mimetype="audio/mpeg")


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
    #format it in a json way ;)
    formats = {
            "name": info.get('title',None),
            "duration": str(datetime.timedelta(seconds=info.get('duration',None))),
            "id" : str(info.get('id',None)+".mp3")
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