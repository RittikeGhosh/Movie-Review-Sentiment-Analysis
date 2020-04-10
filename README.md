# Movie-Review-Sentiment-Analysis

> ### *Must be connected to Internet for the APIs to response*

In the project 2 APIs are used(one for the search result and another to get reviews)
1. https://rapidapi.com/hmerritt/api/imdb-internet-movie-database-unofficial
2. https://rapidapi.com/apidojo/api/imdb8 (need to subscribe)
> You need to add your api key, to do that simply assign your api key you will get from<b>rapidapi</b> to the variable ```key``` in the view.py file.

RECOMMENED: Setup virtual environment:
```
pip3 install vitualenv
python3 -m virtualenv venv
```

To activate the virtual environment:
```
source venv/bin/activate
```

To setup packages for the sentiment-analyzer run the following commands: 
```
git clone https://github.com/RittikeGhosh/Movie-Review-Sentiment-Analysis
pip3 install -r requirements.txt
import nltk
nltk.download()
```

To run the server:
```
cd SentimentAnalysis/
python manage.py runserver
```
**the server will start running and you can see it function by going to 127.0.0.1:8000
