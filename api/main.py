import requests

#function to get auth header (truncated for security reasons)
auth_header = open("api/auth_header.txt")
auth_header_read = auth_header.read


#main auth header
main_header ={"Authorization :Bearer"+str(auth_header_read)}





#params for request
track_name = input("Please input track name: ")
artist_name = input("Please input artist name: ")



#main request
main_request = requests.get("https://api.spotify.com/v1/search"+"%2520track%3A"+track_name+"%2520rtist%3A"+artist_name)
print(main_request.text)