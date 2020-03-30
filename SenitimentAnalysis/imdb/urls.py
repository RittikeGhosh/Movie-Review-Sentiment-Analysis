from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('index', views.index, name='index2'),
    path('search', views.search, name='search'),
    path('analyse', views.analyse, name='analyse'),
    path('<str:show_id>/details', views.details, name='details'),
]