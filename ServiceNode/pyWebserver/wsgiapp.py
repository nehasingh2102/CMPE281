from pymongo import  MongoClient
from bson import Binary, Code
from bson.json_util import dumps
import json

initializeDB = './initial_messages.json'
def run_application(application):
    """Server code."""
    # This is where an application/framework stores
    # an HTTP status and HTTP response headers for the server
    # to transmit to the client
    headers_set = []
    # Environment dictionary with WSGI/CGI variables
    environ = {}
    param = ''

    def start_response(status, response_headers, exc_info=None):
        headers_set[:] = [status, response_headers]

    # Server invokes the application callable and gets back the
    # response body
    result = application(environ, start_response,param)
    # Server builds an HTTP response and transmits it to the client

def gethistory():
 
    db=MongoClient('mongodb://client1:client1@ec2-34-209-84-59.us-west-2.compute.amazonaws.com:27017/?authSource=messages1').messages1
    
    Totalcount = db.myMsgs.find().count()
    msgs = []
    if Totalcount<13 :
        print "less than 13"
        msgs=db.myMsgs.find()
    else:
        print "more than 13"
        msgs=db.myMsgs.find().skip(Totalcount-12)

    msgHistory = []
    for msg in msgs:
        msgHistory.append(msg)
        
    print (msgHistory)
    return dumps(msgHistory)

def insert(param):
    list = param.split("\r\n")
    elem = json.loads(list[len(list)-1])
    print elem['origin']
    obj = [{"result":"success"}]
    
    try:
        db=MongoClient('mongodb://client1:client1@ec2-34-209-84-59.us-west-2.compute.amazonaws.com:27017/?authSource=messages1').messages1
    
        db.myMsgs.insert_one(elem);
        print '\nInserted data successfully\n'
        
    except Exception, e:
        print str(e)
        obj = [{"result":"failure"}]
        return dumps(obj)
    
    return dumps(obj)

def defaultprint(param):
    print "default param: "+param
    obj = [{'result':"noEffect"}]
    return dumps(obj)

def getinit():
    print "initialize"
    obj = [{"result":"success"}]
    
    try:
        db=MongoClient('mongodb://client1:client1@ec2-34-209-84-59.us-west-2.compute.amazonaws.com:27017/?authSource=messages1').messages1
    
        db.myMsgs.drop();
        print '\nInserted data successfully\n'
        
        with open(initializeDB) as data_file:
            data = json.load(data_file)
        initialDB = data['messages']
        print initialDB['msg1']
        print initialDB['msg2']
        db.myMsgs.insert_one(initialDB['msg1']);
        db.myMsgs.insert_one(initialDB['msg2']);
    except Exception, e:
        print str(e)
        obj = [{"result":"failure"}]
        return dumps(obj)
    
    return dumps(obj)

def app(environ, start_response, param):
    """A barebones WSGI app."""
    start_response('200 OK', [('Content-Type', 'application/json'),('Access-Control-Allow-Origin', '*'),('Access-Control-Allow-Headers','access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type')])
    if environ:
        if environ['PATH_INFO'] == '/history':
            return gethistory()
        elif environ['PATH_INFO'] == '/initialize':
            return getinit()
        elif environ['PATH_INFO'] == '/insert' and environ['REQUEST_METHOD'] == "POST":
            print param.getvalue()
            return insert(param.getvalue())
        else:
            return defaultprint(param) 
    else:
        return defaultprint(param)

run_application(app)
