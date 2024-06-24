import requests
import regex as re
from moviepy.editor import *
from pytube import YouTube
import os
from flask import Response,Flask, stream_with_context
from mutagen.mp3 import MP3
import flask



app = Flask(__name__)

#function to replace spaces with + for youtube query
def replace_youtube(string):
    #make a main string splitted in between whitespaces
    main = string.split()
    #replace the whitespace with a + for youtube
    main_join = "+".join(main)
    return main_join
def split_spaces(string):
    main = string.replace("+", " ")
    main_join = main.split()
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
#the 4o4 page
@app.route("/")
def four():
    return("Ooops, this page doesnt exist go to /help to see existing pages")
#main app route
@app.route("/download/<artist_name>/<track_name>")
def main(track_name,artist_name):
    #artist name
    artist = artist_name
    #track name
    track_name = track_name
    #formulate the main search query for youtube
    main_query = "https://www.youtube.com/results?search_query="+replace_youtube(artist)+"-"+replace_youtube(track_name)
    query_get = requests.get(main_query)
    
    #search for video id in response
    video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)
    #make a youtube video link
    video_link = "https://youtube.com/watch?v="+video_id[0]
    download(video_link,track_name)
    return flask.send_file("../"+track_name+".mp3", mimetype="audio/mpeg")
        




       

    

       
        


#add help route
@app.route("/help")
def help():
    #return help message
    return "To get the mp3 file you go, serverip:5000/artist/track_name and to add spaces just use a +\n Also, to get info about a song go, serverip:5000/artist/track_name and you will get duration, artist, and video title"  

@app.route("/info/<artist>/<track_name>") 
def info(track_name,artist):
    main_query = "https://www.youtube.com/results?search_query="+replace_youtube(artist)+"-"+replace_youtube(track_name)
    query_get = requests.get(main_query)
    #search for video id in response
    video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)
    #make a youtube video link
    video_link = "https://youtube.com/watch?v="+video_id[0]
    #donwload the video to get the duration
    download(video_link,track_name)
    #get all the info
    artist_name = artist
    track = track_name
    if artist.find("+") !=-1:
        artist_replace = artist.replace("+", " ")
        artist_split = artist_replace.split()
        artist_name = " ".join(artist_split)
    elif artist.find("+") ==-1:
        pass
    if track_name.find("+") !=-1:
        track_name_replace = track_name.replace("+", " ")
        track_name_split = track_name_replace.split()
        track = " ".join(track_name_split)
    elif track_name.find("+") == -1:
        pass 
    
    video_name = re.findall(str(track), query_get.text)
    video_artist = re.findall(str(artist_name), query_get.text)
    print(artist)
    #get the duration of the mp3
    audio = MP3(track_name+".mp3")
    audio_info = audio.info
    lenght = int(audio_info.length)
    mins = lenght // 60
    secs  = str(lenght)
    #remove the mp3
    os.remove(track_name+".mp3")
    #return the data
    return str(video_artist[0])+"-"+str(video_name[0])+" "+str(mins)+":"+secs[:-1]

#start the app
if __name__ == '__main__':
   app.run(debug=True)
