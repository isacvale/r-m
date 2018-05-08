git add .
git commit -am "One more testing commit: no significant amount of code added"
git push heroku master
heroku ps:scale web=1
heroku open


