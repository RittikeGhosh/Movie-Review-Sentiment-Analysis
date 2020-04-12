from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse
from django.template import loader
from urllib.parse import quote_plus
from  .sentimentanalyzer import MovieReviewSentimentAnalyzer
import requests
import json
import random


# Make sure to add your own api key here
key = "caac253e7fmshd1676ae9bef41dbp1f9a0bjsnb0b721567b87"

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
    global key
    query = request.GET['search-query']

    s_query = query
    if len(query) > 0:
        query = quote_plus(query)
        headers = {
            'x-rapidapi-host': "imdb-internet-movie-database-unofficial.p.rapidapi.com",
            'x-rapidapi-key': key
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
    # return render(request, 'imdb/details.html', context)
    if show_id != None:
        headers1 = {
            'x-rapidapi-host': "imdb-internet-movie-database-unofficial.p.rapidapi.com",
            'x-rapidapi-key': key
            }
        headers2 = {
            'x-rapidapi-host': "imdb8.p.rapidapi.com",
            'x-rapidapi-key': key
        }
        detailUrl = "https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/" + show_id
        reviewUrl = "https://imdb8.p.rapidapi.com/title/get-user-reviews"
        querystring = {"tconst": show_id}
        response = requests.request("GET", detailUrl, headers=headers1)
        response2 = requests.request("GET", reviewUrl, headers=headers2, params=querystring)

        data = response.json()
        data2 = response2.json()
        
        if data['title'] == '':
            raise Http404("Details Does not exist! :-( ")

        context = {
            'data' : data,
            'data2': data2
        }
    else: 
        context = {
            'data' : 'Not Found',
            'data2' : 'Not Found'
        }
    return render(request, 'imdb/details.html', context)