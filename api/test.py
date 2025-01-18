import pytubefix
import flask



app = flask.Flask(__name__)


@app.route("/<video_name>")
def download_video(video_name):
    search = pytubefix.Search(video_name)
    url_list = []
    for video in search.videos:
        url_list.append(video.watch_url)
    video = pytubefix.YouTube(url_list[1])
    video_options = video.streams.get_audio_only()
    video_options.download()
    return flask.send_file("../"+video.title+".m4a", mimetype="audio/mpeg")
    
if __name__ == '__main__':
   app.run(debug=True)