# FoodNutritionSkill

Alexa skill to provide calorie information about various food items. <br/>
Food items are obtained from the API provided by USDA at https://ndb.nal.usda.gov/ndb/api/doc

<b> Steps to Build and run </b> <br/>
 <ol> 
  <li> Clone the repository </li>
  <li> Install node.js and NPM </li>
  <li> Install all node modules as listed in package.json (run npm install) </li>
  <li> Set up lambda local by runnning `npm install -g lambda-local` </li>
  <li> Run `lambda-local -l index.js -h handler -e ./Assets/event.json` </li>
  <li> Make changes to ./Assets/event.json to check responses for different queries </li>
 </ol>
 
 <b> Steps for unit testing </b> <br/>
 <ol> 
  <li> Run `mocha test.js` </li>
  <li> Make changes to test.js -> expResults to add more test cases </li>
 </ol>
 
For generating this skill in the Alexa Skill Kit Developer Console, use the following files in the Assets folder:
<ul>
  <li> FOOD_ITEMS </li>
  <li> IntentSchema.json </li>
  <li> SampleUtterances.txt </li>
