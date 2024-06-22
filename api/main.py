import requests
import re
from moviepy.editor import *
from pytube import YouTube
import os

#function to replace spaces with + for youtube query
def replace_youtube(string):
    main = string.split()
    main_join = "+".join(main)
    return main_join

#donwload function for mp3
def download(url):
    link = YouTube(url)
    stream = link.streams.get_lowest_resolution()
    stream.download(filename=track_name+".mp4")
    video = VideoFileClip(track_name+".mp4")
    audio = video.audio
    audio.write_audiofile(track_name+".mp3")
    os.remove(track_name+".mp4")

#main data for functions
artist = input("Please state the artist: ")
track_name = input("Please input the song name: ")



#formulate the main query for youtube
main_query = "https://www.youtube.com/results?search_query="+replace_youtube(artist)+"-"+replace_youtube(track_name)
print(main_query)
query_get = requests.get(main_query)
video_id = re.findall(r"watch\?v=(\S{11})", query_get.text)
video_link = "https://youtube.com/watch?v="+video_id[0]


    
download(video_link)