'use strict'

var expect = require('chai').expect,  

lambdaToTest = require('./index')


function Context() {
  this.speechResponse = null;
  this.speechError = null;

  this.succeed = function(rsp) {
    this.speechResponse = rsp;
    this.done();
  };

  this.fail = function(rsp) {
    this.speechError = rsp;
    this.done();
  };

}

function validRsp(ctx,options) {
     expect(ctx.speechError).to.be.null;
     expect(ctx.speechResponse.version).to.be.equal('1.0');
     expect(ctx.speechResponse.response).not.to.be.undefined;
     expect(ctx.speechResponse.response.outputSpeech).not.to.be.undefined;
     expect(ctx.speechResponse.response.outputSpeech.type).to.be.equal('SSML');
     expect(ctx.speechResponse.response.outputSpeech.ssml).not.to.be.undefined;
     expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>.*<\/speak>/);
     if(options.endSession) {
       expect(ctx.speechResponse.response.shouldEndSession).to.be.true;
       expect(ctx.speechResponse.response.reprompt).to.be.undefined;
     } else {
       expect(ctx.speechResponse.response.shouldEndSession).to.be.false;
       expect(ctx.speechResponse.response.reprompt.outputSpeech).to.be.not.undefined;
       expect(ctx.speechResponse.response.reprompt.outputSpeech.type).to.be.equal('SSML');
       expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/<speak>.*<\/speak>/);
     }

}

var event = {
  session: {
    new: false,
    sessionId: 'session1234',
    attributes: {},
    user: {
      userId: 'usrid123'
    },
    application: {
      applicationId: 'amzn1.echo-sdk-ams.app.1234'
    }
  },
  version: '1.0',
  request: {
    intent: {
      slots: {
        SlotName: {
          name: 'SlotName',
          value: 'slot value'
        }
      },
      name: 'intent name'
    },
    type: 'IntentRequest',
    requestId: 'request5678'
  }
};




describe('All intents', function() {
  var ctx = new Context();


  describe('Test LaunchIntent', function() {

      before(function(done) {
        event.request.type = 'LaunchRequest';
        event.request.intent = {};
        event.session.attributes = {};
        ctx.done = done;
        lambdaToTest.handler(event , ctx);
      });


     it('valid response', function() {
       validRsp(ctx,{
         endSession: false,
       });
     });

  });
    
    
    var expResults = {
    'butter salted': {
      endSession: true,
      searchResults: 1
    },
    'orange': {
      endSession: false,
      searchResults: 18
    },
    'apples raw': {
      endSession: false,
      searchResults: 11
    },
    'toy': {
      endSession: true,
      searchResults: 0
    }
  };
    
    for(var key in expResults) {

    describe(`Test GetNutritionInfo ${key}`, function() {
        var options = expResults[key];
        var testFood = key;


        before(function(done) {
          event.request.intent = {};
          event.session.attributes = {};
          event.request.type = 'IntentRequest';
          event.request.intent.name = 'GetNutritionInfo';
          event.request.intent.slots = {
            FoodItem: {
              name: 'FoodItem',
              value: testFood
            }
          };
          ctx.done = done;
          lambdaToTest.handler(event , ctx);
        });

       it('valid response', function() {
         validRsp(ctx, options);
       });

       it('valid outputSpeech', function() {
         if(options.searchResults === 0) {
           expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/Could not find any food item/);
         } else {
           var num = ctx.speechResponse.response.outputSpeech.ssml.match(/100 grams/g).length;
           if(options.searchResults > 3) {
             expect(num).to.be.equal(3);
           } else {
             expect(num).to.be.equal(options.searchResults);
           }
         }
       });

      if(!options.endSession) {
       it('valid reprompt', function() {
         expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/You can say/);
       });
      }

    });

    if (!expResults[key].endSession) {

      describe(`Test GetNextEventIntent ${key}`, function() {
          var options = expResults[key];
          var testFood = key;

          before(function(done) {
            event.request.intent = {};
            event.session.attributes = ctx.speechResponse.sessionAttributes;
            event.request.type = 'IntentRequest';
            event.request.intent.name = 'GetNextEventIntent';
            event.request.intent.slots = {};
            ctx.done = done;
            lambdaToTest.handler(event , ctx);
          });

         it('valid response', function() {
           validRsp(ctx, {endSession: true});
         });
          
         it('valid outputSpeech', function() {
           expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(new RegExp(`Your search resulted in ${options.searchResults} food items`));
         });
      });

      describe(`Test AMAZON.StopIntent ${key}`, function() {
          var options = expResults[key];
          var testFood = key;

          before(function(done) {
            event.request.intent = {};
            event.session.attributes = ctx.speechResponse.sessionAttributes;
            event.request.type = 'IntentRequest';
            event.request.intent.name = 'AMAZON.StopIntent';
            event.request.intent.slots = {};
            ctx.done = done;
            lambdaToTest.handler(event , ctx);
          });

         it('valid response', function() {
           validRsp(ctx, {endSession: true});
         });

         it('valid outputSpeech', function() {
           expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/Good Bye./);
         }); 
      });    
    }
  } 
});
