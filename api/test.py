#just a file to run tests
def convert(string):
    main = string.split()
    main_convert = "+".join(main)
    return main_convert


e = "marshall mathers"
estes = convert(e)
print(estes)