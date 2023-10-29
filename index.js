const Twitter = require('twitter-lite');
const language = require("@google-cloud/language");
const languageClient = new language.LanguageServiceClient();

const user = new Twitter({
  consumer_key: "TWITTER_KEY",
  consumer_secret: "TWITTER_KEY",
});

// Enveloppe le code suivant dans une fonction asynchrone qui est appelée
// immédiatement afin que nous puissions utiliser les instructions "await".
(async function() {
    try {
      // retrouver le bearer token de twitter
      let response = await user.getBearerToken();
      // Construire notre client API avec le jeton du porteur.
      const app = new Twitter({
        bearer_token: response.access_token,
      });

      // Recherche de tweets récents à partir de l'API Twitter
      response = await app.get(`/search/tweets`, {
        q: "Lionel Messi",
        lang: "fr",
        count: 100,
      });

      // boucler sur tous les tweet recu
      let allTweets = "";
      for (tweet of response.statuses) {
        allTweets += tweet.text + "\n";
      }

      // recup le sentiment de chaque tweet
      const sentimentScore = await getSentimentScore(allTweets);
      console.log(`The sentiment about ${query} is: ${sentimentScore}`);

    } catch(e) {
        console.log("Une erreur s'est produite lors de l'appel de l'API Twitter.");
        console.dir(e);
    }
})();

// utilisation de google-cloud/language pour recupèrer le sentiment des tweet (aime ou aime pas le sujet)
async function getSentimentScore(text) {
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    const [result] = await languageClient.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;

    return sentiment.score
}