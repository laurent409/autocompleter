var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
  host : 'localhost:9200',
  log : 'info'
});

var indexName = 'randomindex';

//Delete existing index
function deleteIndex(){
  return elasticClient.indices.delete({
    index: indexName
  });
}
exports.deleteIndex = deleteIndex;

//Create the index
function initIndex(){
  return elasticClient.indices.create({
    index: indexName
  });
}
exports.initIndex = initIndex;

//Check if index is already existing
function checkIndex(){
  return elasticClient.indices.exists({
    index: indexName
  });
}
exports.checkIndex = checkIndex;

checkIndex.then(function(exists) {
  if (exists)
    return deleteIndex();
}).this(initIndex);

function initMapping(){
  return elasticClient.indices.putMapping({
    index: indexName,
    type: "document",
    body: {
      properties: {
        title: { type: "string"},
        content: {type: "string"},
        suggest: {
          type: "completion",
          analyzer: "simple",
          search_analyser: "simple",
          payloads: true
        }
      }
    }
  });
}
exports.initMapping = initMapping;

function addDocument(document){
  return elasticClient.index({
    index: indexName,
    type: "document",
    body: {
      properties: {
        title: document.title,
        content: document.content,
        suggest: {
          input: document.title.split(" "),
          output: document.title,
          payloads: document.metadata || {}
        }
      }
    }
  })
}
exports.addDocument = addDocument;

function getSuggestions(input) {
  return elasticClient.index({
    index: indexName,
    type: "document",
    body: {
      docsuggest: {
        text: input,
        completion: {
          field: "suggest",
          fuzzy: true
        }
      }
    }
  });
}
exports.getSuggestions = getSuggestions;
