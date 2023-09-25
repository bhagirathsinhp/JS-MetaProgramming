// Symbols;
const uid = Symbol("uid");
console.log(uid);

const user = {
  // id: 'p1',
  [uid]: "p1",
  name: "Max",
  age: 30,
  [Symbol.toStringTag]: "User",
};

user[uid] = "p3";
user.id = "p2";
console.log(user.toString());

// Iterators;
// const company = {
//   curEmployees: 0,
//   employees: ["Max", "Manu", "Anna"],
//   next() {
//     if (this.curEmployees >= this.employees.length) {
//       return { value: this.curEmployees, done: true };
//     }
//     const returnVal = {
//       value: this.employees[this.curEmployees],
//       done: false,
//     };
//     this.curEmployees++;
//     return returnVal;
//   },
//   [Symbol.iterator]: function* employeeGenerator() {
//     let employee = company.next();
//     while (!employee.done) {
//       console.log(employee.value);
//       employee = company.next();
//     }
//   },
// };

// console.log(company.next());
// console.log(company.next());
// console.log(company.next());
// console.log(company.next());
// console.log(company.next());

// let employee = company.next();
// while (!employee.done) {
//   console.log(employee.value);
//   employee = company.next();
// }

// Generators;
const company = {
  employees: ["Max", "Manu", "Anna"],
  // getEmployee:
  [Symbol.iterator]: function* employeeGenerator() {
    let currentEmployee = 0;
    while (currentEmployee < this.employees.length) {
      yield this.employees[currentEmployee];
      currentEmployee++;
    }
  },
};
// console.log(company.getEmployee().next());

// const it = company.getEmployee();
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());

for (const employee of company) {
  console.log(employee);
}

console.log([...company]);

// ---- Reflect API.

const course = {
  title: "JS - The Complete Guide",
};
Reflect.setPrototypeOf(course, {
  toString() {
    return this.title;
  },
});
console.log(course.toString());

// Reflect.deleteProperty(course, "title");
// console.log(course);

const courseHandler = {
  get(obj, propertyName) {
    console.log(propertyName);
    if (propertyName === "length") {
      return 0;
    }
    return obj[propertyName] || "Not Found";
    // return 'Something...'
  },
  set(obj, propertyName, newValue) {
    if (propertyName === "price") {
      return;
    }
    obj[propertyName] = newValue;
  },
};

const pCourse = new Proxy(course, courseHandler);
pCourse.price = 5;
console.log(pCourse.title, pCourse.length, pCourse.price);
