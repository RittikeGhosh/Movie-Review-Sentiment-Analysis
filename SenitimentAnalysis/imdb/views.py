from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.template import loader
from urllib.parse import quote_plus
import requests

# Create your views here.

def index(request):
    # template = loader.get_template('imdb/index.html')
    # return HttpResponse(template.render({}, request))
    # return HttpResponse("Welcome")
    return render(request, 'imdb/index.html')


def search(request):
    query = request.GET['search-query']

    if len(query) > 0:
        s_query = query
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


def details(request, show_id = None):
    if show_id != None:
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