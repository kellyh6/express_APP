var bcrypt = require('bcrypt');
var password = 'test'; // for testing purposes
var wrongPassword = 'nope';

//Test hashing the password
var hash = bcrypt.hashSync(password, 10);
console.log('This is the value after hashSync is called:')
console.log(hash);
console.log("-------------------------");

//Test comparing the password hash to the correct password
//First: user typed in, second: existing password hash
var isValid = bcrypt.compareSync(password, hash);
console.log("user typed in password:", password, "and this was", isValid.toString());

//test comparing the password to the worng password
var isValid2 = bcrypt.compareSync(wrongPassword, hash);
console.log("user typed in password:", wrongPassword, "and this was", isValid2.toString());
console.log("-------------------------");