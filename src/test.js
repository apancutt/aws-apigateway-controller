const original = {
  method: 'GET',
  path: '/',
};

const middlewares = [

  (request) => {
    console.log(1, request.path);
    return {
      ...request,
      path: '/1',
    };
  },
  (request) => {
    console.log(2, request.path);
    request.path = '/2';
    return request;
  },
  (request) => {
    console.log(3, request.path);
    request.path = '/3';
    return request;
  },

];


/*
const request2 = middlewares.reduce((request, middleware) => {
  return middleware(request);
}, request);
*/

middlewares.reduce((promise, middleware) => promise.then(middleware), Promise.resolve(original))
  .then((final) => {
    console.log('original', original);
    console.log('final', final);
  });
