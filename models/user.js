class User {

    constructor({id, firstName, lastName, email, picture}){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.picture = picture;
    }

}

module.exports = User;