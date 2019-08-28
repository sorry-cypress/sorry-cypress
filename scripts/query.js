function printRes(result) {
  print(tojson(result));
}

// const result = db.runs.find({
//   runId: 'c96b420a3ae4eb486716774ab66bace2',
//   specs: {
//     $elemMatch: {
//       instanceId: '8fb2f059-16e8-49a4-a1dd-447e8efe8e60',
//       claimed: false
//     }
//   }
// });

const result = db.runs.updateOne(
  {
    runId: 'c96b420a3ae4eb486716774ab66bace2',
    specs: {
      $elemMatch: {
        instanceId: '8fb2f059-16e8-49a4-a1dd-447e8efe8e60',
        claimed: 'special'
      }
    }
  },
  {
    $set: { 'specs.$[spec].claimed': true }
  },
  {
    arrayFilters: [
      { 'spec.instanceId': '8fb2f059-16e8-49a4-a1dd-447e8efe8e60' }
    ]
  }
);
print(tojson(result));
// result.forEach(printRes);

// get_results(result);

// db.getCollection('runs')
//   .find()
//   .forEach(get_results);
