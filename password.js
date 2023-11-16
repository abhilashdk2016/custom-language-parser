let passwords = ["abc123Def", "123", "456", "789"];
let newPassword = "ABC123Def";
let isNotPresent = true;
for (let i = 0; i < passwords.length; i++) { 
    if (passwords[i].toLowerCase() === newPassword.toLowerCase()) { 
        isNotPresent = false; 
    } 
} 

if(passwords.length === 10) {
    passwords.shift();
    passwords.push(newPassword)
} else if(isNotPresent) {
    passwords.push(newPassword);
}
console.log(passwords);
if("abhi@oneaDvanced".toLowerCase().includes("oneadvanced")) {
    console.log("Should not contain company name");
}