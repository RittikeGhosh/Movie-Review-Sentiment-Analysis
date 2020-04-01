import string
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews
from nltk.sentiment.vader import SentimentIntensityAnalyzer


class MovieReviewSentimentAnalyzer:
    ''' Call function MovieReviewSentimentAnalyzer.analyze(review) to get the sentiment poll and score.
        Class uses Naive Bayes Classifier to classify review as positive or negative.
        Class uses VADER library to find the sentiment score.
        The review must not be too long nor too short.
    '''

    def __init__(self, text):
        self.review = text

    # function for cleaning the text
    def clean_text(self, text):
        lower_case = text.lower().strip()
        cleaned_text = lower_case.translate(str.maketrans('', '', string.punctuation)) # removing punctuations !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
        return cleaned_text

    # function for tokenizing and removing stop words
    def tokenize_and_remove_stop_words(self, text): 
        tokenized_words = word_tokenize(self.clean_text(text), 'english')
        word_list = [word for word in tokenized_words if word not in stopwords.words('english')]
        return word_list

    # function to return input expected by the Naive Bayes classifier
    def return_word_features(self, words):
        word_dict = {word:True for word in words}
        return word_dict
    
    # function to train the naive bayes classifier
    def configure_naive_bayes_classifier(self):
        neg_reviews = [(self.return_word_features(movie_reviews.words(fid)), 'Negative') for fid in movie_reviews.fileids('neg')]
        pos_reviews = [(self.return_word_features(movie_reviews.words(fid)), 'Positive') for fid in movie_reviews.fileids('pos')]

        # print(neg_reviews[0])
        # print(len(neg_reviews))
        # print(pos_reviews[0])
        # print(len(pos_reviews))

        train_set = neg_reviews[:900] + pos_reviews[:900]
        test_set = neg_reviews[900:] + pos_reviews[900:]
        # print(len(train_set), len(test_set))

        classifier = NaiveBayesClassifier.train(train_set)
        accuracy = nltk.classify.util.accuracy(classifier, test_set)

        # print(accuracy)
        return classifier

    # function taking review for sentiment analysis
    def review_sentiment_analyzer(self, review):
        classifier = self.configure_naive_bayes_classifier()
        probabilities = classifier.prob_classify(self.return_word_features(self.tokenize_and_remove_stop_words(review)))
        predicted_sentiment = probabilities.max()
        return predicted_sentiment

    def review_score(self, review):
        score = SentimentIntensityAnalyzer().polarity_scores(self.clean_text(review))['compound']
        percentage = (score * 100 + 100)/ 200 * 100
        return round(percentage, 2)

    # function to start sentiment analysis
    def analyze(self):
        review_poll = self.review_sentiment_analyzer(self.review)
        review_score = self.review_score(self.review)
        return (review_poll, review_score)


if __name__ =='__main__':
    # Enter your reviews here
   result = MovieReviewSentimentAnalyzer("The movie was just fine").analyze()
   print(result)