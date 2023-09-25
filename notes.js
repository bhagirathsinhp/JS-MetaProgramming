// 26. Meta Programming - Symbols, Iterators, Generators, Reflect API & Proxy API....



// These things are interesting to Library authors - we won't use them often.
// These aren't somethings like adding click listeners to a button which doesn't something which our end users in the end have something from.
// These features makes lives easy for other devs.
// These features allows us to change the way certain parts of the code behave or work, they allow us to improve code safety, not from a security standpoint but from an API standpoint - so that we can make sure that functions or objects that we expose to other developers are used properly.
// These features also might come in handy when we would be building advanced projects.


------------------------------------------------------------------------------------------------------------


// 1. Understanding Symbols...

// Symbols are primitive values - not objects, not reference values..
// Used as object property identifiers - as keys in object just like numbers and strings.
// There are symbols that are built-in & also there are symbols creatable by devs.
// Every symbol is unique.
// Can't override symbols with same names.

// We create a new symbol by calling - Symbol().
Symbol()
const uid = Symbol();
// We can pass something in symbol but that would be only for identification purposes only.
const uid = Symbol('uid');

// How to use a symbol?
const user = {
  id: 'p1',
  name: 'Max',
  age: 30
}
// Now just imagine we are building a library where we are exposing certain object with the users of our library.
// Now in the object there would be certain keys which we wanna make sure aren't over-ridden by users.

// Now above object is some user object that our library generates which allow our users to create any of their liking but we wanna make sure the id identifier can't be overridden.
user.id = 'p2' // we don't want this.

// We do it by...
const user = {
  // id: 'p1',
  [uid]: 'p1',
  name: 'Max',
  age: 30
}
// We used [] to point at a variable which here is our symbol const.
// So if we use this..
user.id = 'p2' // this will just be added inside the user object.

console.log(user[Symbol('uid')]);
// Here too we would get undefined.
// This new symbol is a totally different object than the above one.

// IMP - if we don't expose the symbol const to our library users they can't change it but if we do - they can..
user[uid] = 'p3';

// It's not mandatory to add identifier inside Symbol(), we add it cause we as dev can use it to debug.


--------------------------------------------------------------------------------------------------------------


// 2. Well-known Symbols...

// Built-in modern JS.
// We can access well-known symbols using . notation to Symbol

// Symbol.

// Let's look at an example.
// We can't convert an object to a string.
// When we use toString to any object we see [object Object] printed.
// We can't turn it into a string but we can add a tag to this toString object.
// We can do it by adding toStringTag symbol to the object.

const user = {
  // id: 'p1',
  [uid]: "p1",
  name: "Max",
  age: 30,
  [Symbol.toStringTag]: 'User'
};

console.log(user.toString())
// This inside console will show [object User].
// Although this is unimportant to us - we get the idea how built-in symbols works.


--------------------------------------------------------------------------------------------------------------


// 3. Understanding Iterators....

// Iterator is an object which has a next method which in turn return a result of a certain structure.

const company = {
  employees: ['Max', "Manu", 'Anna'],
  // We turn this into an iterator by adding a next method - name must be next..
  next() {
    return {
      value: this.employees[0], done: false
    }
  }
};

// We added return object where we have a value property.
// Also a done property - which signal whether we have more values we can output or not..

// We will see the idea behind this next method in a bit, let's create it properly first.

const company = {
  curEmployees: 0,
  employees: ['Max', "Manu", 'Anna'],
  next() {
    if(this.curEmployees >= this.employees.length){
      return {value: this.curEmployees, done: true}
    }
    const returnVal = {
      value: this.employees[this.curEmployees], done: false
    }
    this.curEmployees++;
    return returnVal;
  }
};

// The idea is that we can console.log(company.next()) & execute it couple of times down.
// There if we look into console - we see all different employees until we're done.

// IMP = Here we create our own method that allows us to loop through a specific field of this object &  we could have any looping logic we want in here.

// This creates a loopable object.
// Right now we can't use for-of but soon we can use it.
// With the help of done value set to true/false, we'll know if we have to call next again if there's any values left or not.

// We can also use logic on our iterator logic..
let employee = company.next();
while(!employee.done){
  console.log(employee.value);
  employee = company.next()
}
// Thus, we have a dynamic loop with our employee names on the console.


--------------------------------------------------------------------------------------------------------------


// 4. Generators & Iterable Objects....

// SLIGHTLY CONFUSING - LOOK AT THE EXPLANATION AGAIN...

// Now if we use for/of loop on employee of company we will see company not an iterator inside console.
// It's cause JS was looking for symbol in the company object.
// That symbol is-
[Symbol.iterator]: // The value of this symbol has to be an iterator.  
// Company is an iterator. Every object with next method is an iterator.

// What we store for this symbol.iterator property should be such aan object with next method.
// Company having next method doesn't help us.
// The object with next method inside symbol.iterator will make for/of usable.

// We will use something which builds us such iterator rather than building object manually.
// That would be a GENERATOR. 

// It's what builds an object with built-in next().
// To use it = function*...
// We can use any name for this function or can use anonymous function.
[Symbol.iterator]: function* employeeGenerator(){}
// Inside this generator function we can now write our looping logic.

// Now we can take our while loop and move it inside the generator function.

[Symbol.iterator]: function* employeeGenerator(){
  let employee = company.next();
  while (!employee.done) {
    console.log(employee.value);
    employee = company.next();
  }
}

// Here instead of consoling the employee - we use another JS keyword - YIELD..

[Symbol.iterator]: function* employeeGenerator(){
  let employee = company.next();
  while (!employee.done) {
    // console.log(employee.value);
    yield employee.value;
    employee = company.next();
  }
}

// We alternatively wrap the logic with while loop inside next() {} and use it inside the generator function.

[Symbol.iterator]: function* employeeGenerator(){
  let currentEmployee = 0;
  while(currentEmployee<this.employee.length){
    yield this.employee[currentEmployee];
  }
}

// We go through all the employees.
// Yield keyword is a bit like return, it returns the thing after it as a value, as a result of this function call.

// If the generator function gets executed, an iterator object with next() will be created.
// Then the yield keyword will define the return value of every call to the next method in that generator object.
// After encountering yield - it returns the value after yield and pauses at the point where we had called yield & when then when we execute the same function again, it doesn't start from the scratch again but continue running at the point where it paused before..

// Let's look at an example of it...
// We comment all the before company logic and add this newly.
const company = {
  employees: ['Max', 'Manu', 'Anna'],
  getEmployee: function* employeeGenerator(){
    let currentEmployee = 0;
    while(currentEmployee<this.employees.length){
      yield this.employees[currentEmployee]
    }
  }
}
console.log(company.getEmployee().next())
// We have to call next() to the result of the generated iterator.

// Now if we console this multiple times we can see the value inside the object is just Max.
// We get Max always vause we generate a new iterator.

// To get all the employees. 
// we should create a new const and call company.getEmployee() on it.
const it = company.getEmployee();
console.log(it.next())
// We also add - currentEmployee++.
// Now if we call this multiple times.
// We get our employee list.

// With generator logic we don't have to write our own next method like we did before.
// We have the short logic.

// * helps JS build generator object.
// Yield is the point where JS saves the current state of execution and the next time we call next() on the created iterator, it will continue from that point on and therefore it'll give us the next value and the next value and the next.

// Now if we use Symbol.iterator instead of [getEmployee] - we can tap into some native JS features to loop through our object.
// Now we can do this...

for (const employee of company){
  console.log(employee);
}

// We'll get the names of our employees on our console.

// Now with this - for loop goes looping through the object, searches for symbol.iterator then it executes the function which is generator function - so that it returns an iterator.
// JS then executes the next() on that iterator as long as done is not true and extracts the value property into employee const in for/of loop..

// Iterators and generators are very advanced features but they can come in handy when we wanna write our own looping logic.
// We can either do it manually by adding next method or we write a generator function together with yield keyword.

// We can also use spread operator on this object.
console.log([...company]);


-------------------------------------------------------------------------------------------------------------


// 5. Generators Summary & Built-in Iterables Examples....

// The iterator symbol with iterator object is used under the hood by arrays.
const persons = ['Max', 'Manu']
// Symbol.iterator is a prototype property of array.


-----------------------------------------------------------------------------------------------------------


// 6. The Reflect API...

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect

// Reflect API controls objects in JS.
// It itself is an object.
// It has standardized and grouped together methods.
// Used to control how our code is used & how it behaves.

const course = {
  title: "JS - The Complete Guide",
};
// We got reflect api which we can acess with the global reflect object with . notation which has bunch of static mehtods we can use.

Reflect.setPrototypeOf(course, {
  toString(){return this.title;}
})
// Here we set prototype of oour course object to an object with our own toString() to return title.
console.log(course.toString());
// Here we don't use the default toString() method but our own and we can see that in the console we get - JS - The Complete Guide.

// We can also use other methods.
// With define property we can add a new property.
// We can add a new property with the object descriptor too.

// Reflect API gives us a bunch of methods that helps us change objects, work with objects on meta level.
// We as authors of third-party library, we wanna expose certain objects and we wanna make sure that certain properties can't be changed by the devs using our library.
// But then the obvious question is..

// WHY USE REFLECT API.
// We have the global Object that can do the same.

// The Reflect API is newer - Object API is way older.
// Reflect has 2 advantages over Object.

// For one there are subtle differences regarding the behavior of some methods.
// On object if some method fail to do its job - it would return undefined or fail silently.
// On Reflect - we would get a better error or it just returns True of False for a given method.

// Reflect API bundles all the features that we need to work with an object.
// Like deleteProperty - which we don't find in the Object API.
Object.deleteProperty(course, 'title');
// This would throw an error.
// With reflect...
Reflect.deleteProperty(course, 'title');
// This would return true or false depending on whether the operation succeeded or not.

// Idea behind Reflect is that all methods to work on object are bundled in it.
// We don't have to use scattered methods.


-----------------------------------------------------------------------------------------------------------


// 7. The Proxy API and a First "Trap"....

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#a_complete_traps_list_example

// Meta-programming means we configure our code to behave in a certain way when other people use it.

// Proxy API is all about creating so-called TRAPS for certain object opertations.
// We can step it up on certain operations and execute our own code.
// For eg: if someone wants to retrieve a property - a value for a property of an object, with the proxy API, we can set up some logic that runs in that case which allows us to either change what it returned or do some additional task.
// This is on meta level where we might wanna track property access or make sure the objects of our library are used properly

// We work on course object with proxy api.
// We instantiate a new Proxy object.
const pCourse = new Proxy();

// This constructor function takes the object it's applied on.
new Proxy(course);

// The name proxy we know that from networking - we us\e a proxy server to disguise our IP address to basically reach out to the web by funneling our traffic to another server which then is the actial server talking to the website - here it's kinda similar.

// We wrap an extra object around our existing object.
// The constructor function actually needs 2 args.
// 1st is the object we wanna wrap(proxy).
// 2nd is another object which defines certain handlers for the wrapped object.
// So certain behaviors or certain operations we wanna perform on the wrapped object where we can step in.

// For this we create a new const with hanlder functionalities - certain traps.
// Here we use GET trap.
// The traps are defined in MDN document whose link is above.
// GET - we define it as a method - it's executed whenever someone tries to read a value from the wrapped object.

const courseHandler = {
  get(){}
};

// GET method takes 2 args which are passed in automatically by the proxy API.
// 1st is the object that we wrapped.
// 2nd is the propertyName that's gonna be accessed.
// These are both on which the get access happens.

const courseHandler = {
  get(obj, propertyName){
    console.log(propertyName);
    return obj[propertyName]
  }
};
// We console the property name for now.
// We returned obj[propertyName]  which means for the wrapped object, we access this property name which we tried to access & then return a value which is stored in there.
// Which means we forward the value retrieval request without blocking it, without changing it.
// We just retrieve the value which someone try to get for this object and give it to that someone.

const pCourse = new Proxy(course, courseHandler)
console.log(pCourse.title);

// The title property exist on this object cause the proxy object which is actually stored in pCourse wtaps itself around this wrapped object & assumes all the properties & methods on this wrapped object - funneling all the access through the traps we defined here in the handler.

// If we see in the console.
// We can see that - title & JS - The Complete Guide are printed.
// Title - we consoled it in get with property name..
// JS - The Complete Guide - is from the pCourse.title console.

// Thus whenever we try to access pCourse - the get (courseHandler) codes get executed.
// It tells us which property we try to access - the title property.

// In return - it's defined what is returned for the get trap.
// Here we give JS - The Complete Guide which is the actual value but we can give anything, for eg:
return 'something...'
// And in console - we see something takes the place of our actual title.

// Neither course not pCourse are changed by the proxy.

// We have this trap which steps in whenever we try to get any value of any property.
// We overriding what we return.
// We can check the obj property too...

const courseHandler = {
  get(obj, propertyName) {
    console.log(propertyName);
    return obj[propertyName] || 'Not Found';
  },
};

// now if we console something which isn't there...
console.log(pCourse.title, pCourse.lenght)
// We get the title and then Not Found.
// Right now we aren't using it to block access but to improve the usage of the object.
// In our library - if a dev tries to use this object and tries to access which isn't there - then it would show undefined by default - but we wanna return some other default value - not found or a number or anything - we can do that.

// Also we can take into account which property the user tries to access...
if(propertyName === 'length'){
  return 0;
}
// So if the user tries to access the property named length - it would return something else and for default - it would use the not found..
// We return 0 for length but for other properties that doesn't exist like price - we return not found.

// We have other traps tooo......


--------------------------------------------------------------------------------------------------------------


// 8. Working with Proxy Traps...

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#a_complete_traps_list_example

// The set trap allows to step in when users try to set a value for given property.
// We use set(){}
// For parameter - we use object(obj), the propertyName users try to change & newValue - the new value the users try to put in.
// Then we can use the set method to validate all the incoming values to lock down access entirely by not doing anything in here or just simply forward that. OR...

const courseHandler = {
  get(obj, propertyName) {
    console.log(propertyName);
    if (propertyName === "length") {
      return 0;
    }
    return obj[propertyName] || "Not Found";
    // return 'Something...'
  },
  set(obj, propertyName, newValue){
    obj[propertyName] = newValue;
  }
};
// We set the property name on the object to add a new value.
pCourse.price = '5';
// We could see this inside the console.

// We could if check if people try to set the price.

set(obj, propertyName, newValue){
  if(propertyName === 'price'){
    return;
  }
  obj[propertyName] = newValue;
}
// So now we set Not Found to the price.
// In the set trap we blocked access by returning propertyName.
// We can also send data to our analytics server - sending data to register any settings to any properties.
// We're free to execute anything we want in these traps.

// Difference of these from getters & setters is that we set a specific proeprty to getter & setter.
// These traps are however flexible - they aren't bound to any specific proeprty name.


-------------------------------------------------------------------------------------------------------------


/* 

More about Symbols (MDN): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol

List of Well-Known Symbols: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#Well-known_symbols

More about Iterators & Generators (MDN): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators

More about the Reflect API (MDN): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect

More about the Proxy API (MDN): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

List of all Proxy API Traps: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#A_complete_traps_list_example

*/