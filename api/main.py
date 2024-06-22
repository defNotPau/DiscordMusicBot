import requests

#function to open file
main_file = open("api/auth_header.txt", "r")
main_data = main_file.read()

#main data for request(for example artist and song name)
artist = input("Please state the artist: ")
track_name = input("Please input the song name: ")
headers = {
    'Authorization': 'Bearer '+main_data,
}



#header and data
request = "https://api.spotify.com/v1/search?q=+%2520track%3A"+track_name+"%2520artist%3A"+artist+"&type=track"
main_request = requests.get(request, headers=headers)

#store the main_request to a file
request_file = open("api/request.txt", "w")
request_file.write(main_request.text)
request_file.close
