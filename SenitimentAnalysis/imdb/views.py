from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse
from django.template import loader
from urllib.parse import quote_plus
from  .sentimentanalyzer import MovieReviewSentimentAnalyzer
import requests

# Create your views here.

def index(request):
    # template = loader.get_template('imdb/index.html')
    # return HttpResponse(template.render({}, request))
    # return HttpResponse("Welcome")
    # url = "https://api.themoviedb.org/3/discover/movie?api_key=5425b76882cb33f92ad0f493bf3907ce&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false"
    # response = requests.request("GET", url)
    # print(response.json)
    # data=response.json()
    # context = {'data': data}
    return render(request, 'imdb/index.html')


def search(request):
    query = request.GET['search-query']

    s_query = query
    if len(query) > 0:
        query = quote_plus(query)
        headers = {
            'x-rapidapi-host': "imdb-internet-movie-database-unofficial.p.rapidapi.com",
            'x-rapidapi-key': "caac253e7fmshd1676ae9bef41dbp1f9a0bjsnb0b721567b87"
            }
        domain = "https://imdb-internet-movie-database-unofficial.p.rapidapi.com"
        endpoint1 = 'search'
        url = '/'.join((domain, endpoint1, query))
        response = requests.request("GET", url, headers=headers)
        data = response.json()
        context = {
            'len': len(data['titles']),
            'data': data['titles'],
            'query' : s_query
        }
    else:
        context = {
            'len': 0,
            'query' : s_query
        }
    return render(request, 'imdb/search.html', context)


def analyse(request):
    if request.method == "GET":
        text = request.GET['text']
        _, percent = MovieReviewSentimentAnalyzer(text).analyze()
        data = {
            'name': request.GET['name'],
            'text': request.GET['text'],
            'percent': percent
            }
    return JsonResponse(data)


def details(request, show_id = None):
    # return render(request, 'imdb/details.html')
    if show_id != None:
        # api call 
        headers = {
            'x-rapidapi-host': "imdb-internet-movie-database-unofficial.p.rapidapi.com",
            'x-rapidapi-key': "caac253e7fmshd1676ae9bef41dbp1f9a0bjsnb0b721567b87"
            }
        domain = "https://imdb-internet-movie-database-unofficial.p.rapidapi.com"
        endpoint2 = 'film'
        url = '/'.join((domain, endpoint2, show_id))
        response = requests.request("GET", url, headers=headers)
        data = response.json()
        print(data)
        if data['title'] == '':
            raise Http404("Details Does not exist! :-( ")
        context = {
            'data' : data
        }
    else: 
        context = {
            'title' : 'GOT: game of thrones'
        }
    return render(request, 'imdb/details.html', context)