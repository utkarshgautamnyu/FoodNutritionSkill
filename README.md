# FoodNutritionSkill

Alexa skill to provide calorie information about various food items. <br/>
Food items are obtained from the API provided by USDA at https://ndb.nal.usda.gov/ndb/api/doc

<b> Steps to Build and run </b> <br/>
 <ol> 
  <li> Clone the repository </li>
  <li> Install node.js and NPM </li>
  <li> Install all node modules as listed in package.json (run npm install) </li>
 <li> Set up lambda local by runnning <code> npm install -g lambda-local </code> </li>
  <li> Run <code> lambda-local -l index.js -h handler -e ./Assets/event.json </code> </li>
  <li> Make changes to ./Assets/event.json to check responses for different queries </li>
 </ol>
 
 <b> Steps for unit testing </b> <br/>
 <ol> 
  <li> Run <code> mocha test.js </code> </li>
  <li> Make changes to test.js -> expResults to add more test cases </li>
 </ol>
 
For generating this skill in the Alexa Skill Kit Developer Console, use the following files in the Assets folder:
<ul>
  <li> FOOD_ITEMS </li>
  <li> IntentSchema.json </li>
  <li> SampleUtterances.txt </li>
