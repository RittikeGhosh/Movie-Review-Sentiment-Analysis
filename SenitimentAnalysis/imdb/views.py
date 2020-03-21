from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.template import loader

# Create your views here.

def index(request):
    # template = loader.get_template('imdb/index.html')
    # return HttpResponse(template.render({}, request))
    # return HttpResponse("Welcome")
    return render(request, 'imdb/index.html')

def details(request):
    content = {
        'title' : 'GOT: game of thrones'
    }
    return render(request, 'imdb/details.html', content)